import useFirestoreUser from './useFirestoreUser'
import useFirestore from './useFirestore'
import { arrayUnion, arrayRemove } from 'firebase/firestore'
import { BoardEntity } from '../pages/boards/components/boardTable/boardTable'
import { SerializedExcalidrawElement } from '../pages/board/components/excalidrawBoard/excalidrawBoard'
import { BinaryFiles } from '@excalidraw/excalidraw/types/types'

export type BoardContentEntity = {
  elements: SerializedExcalidrawElement[]
  files: BinaryFiles
}

const useBoardRoom = () => {
  const { updateUserData, getUserData } = useFirestoreUser()
  const { updateDocField, getSingleCollectionItem } = useFirestore()

  const joinRoom = (roomId: string, userId: string) => {
    return getSingleCollectionItem<BoardEntity>({ collectionId: 'boards', id: roomId }).then(
      (board) => {
        if (board.users.find((user: { id: string }) => user.id === userId)) {
          return board
        } else {
          return getUserData(userId).then((userData) => {
            return updateDocField({
              collectionId: 'boards',
              id: roomId,
              data: {
                ...board,
                users: arrayUnion({
                  name: userData.firstName,
                  id: userData.id,
                  creator: false,
                }),
              },
            }).then(() => {
              return updateUserData(userId, {
                userBoards: [...userData.userBoards, roomId],
              }).then(() => board)
            })
          })
        }
      },
    )
  }

  const leaveRoom = (roomId: string, userId: string) => {
    return getSingleCollectionItem<BoardEntity>({ collectionId: 'boards', id: roomId }).then(
      (board) => {
        if (board.users.find((user: { id: string }) => user.id === userId)) {
          return getUserData(userId).then((userData) => {
            return updateDocField({
              collectionId: 'boards',
              id: roomId,
              data: {
                ...board,
                users: arrayRemove({
                  name: userData.firstName,
                  id: userData.id,
                  creator: false,
                }),
              },
            }).then(() => {
              return updateUserData(userId, {
                userBoards: arrayRemove(roomId) as unknown as string[],
              }).then(() => true)
            })
          })
        } else {
          throw new Error('User not found in board list')
        }
      },
    )
  }

  return { joinRoom, leaveRoom }
}

export default useBoardRoom
