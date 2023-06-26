import useFirestoreUser from './useFirestoreUser'
import useFirestore from './useFirestore'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { BoardEntity } from '../pages/boards/components/boardTable/boardTable'
import { SerializedExcalidrawElement } from '../pages/board/components/excalidrawBoard/excalidrawBoard'
import { BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { RequestData, RequestEntity, RequestTypes } from '../shared/types'
import { v4 as uuidv4 } from 'uuid'

export type BoardContentEntity = {
  elements: SerializedExcalidrawElement[]
  files: BinaryFiles
}

const useBoardRoom = () => {
  const { updateUserData, getUserData } = useFirestoreUser()
  const { updateDocField, getSingleCollectionItem } = useFirestore()

  const joinRoom = (board: BoardEntity, userId: string) => {
    const alreadyInBoard = board.users.find((user: { id: string }) => user.id === userId)

    return new Promise((resolve, reject) => {
      if (alreadyInBoard) {
        return resolve(true)
      } else {
        return getUserData(userId)
          .then((userData) => {
            return updateDocField({
              collectionId: 'boards',
              id: board.boardId,
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
                userBoards: [...userData.userBoards, board.boardId],
              })
                .then(() => resolve(board))
                .catch(() => reject(new Error('No data found')))
            })
          })
          .catch(() => reject(new Error('No data found')))
      }
    })
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

  const createRequest = (roomId: string, requestData: RequestData) => {
    const request: RequestEntity = {
      ...requestData,
      id: uuidv4(),
      date: 'now',
    }

    return getSingleCollectionItem<BoardEntity>({ id: roomId, collectionId: 'boards' }).then(
      (boardData) => {
        const alreadyAskForAccess = boardData.requests.find(
          (existedRequest) => existedRequest.metaData.userId === requestData.metaData.userId,
        )
        if (requestData.type === RequestTypes.access && boardData && alreadyAskForAccess){
          throw new Error('Already asked access request')
        }

          return updateDocField({
            collectionId: 'boards',
            id: roomId,
            data: {
              requests: arrayUnion(request),
            },
          })
      },
    )
  }

  return { joinRoom, leaveRoom, createRequest }
}

export default useBoardRoom
