import useFirestoreUser from './useFirestoreUser'
import useFirestore from './useFirestore'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { BoardEntity } from '../pages/boards/components/boardTable/boardTable'
import { SerializedExcalidrawElement } from '../pages/board/components/excalidrawBoard/excalidrawBoard'
import { BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { v4 as uuidv4 } from 'uuid'
import { deserializeFbaseToExc } from '../shared/utils'
import useNotifications, { NotificationTypes } from './useNotifications'
import { UserEntity } from '../providers/firebaseUserProvider'

export type BoardContentEntity = {
  elements: SerializedExcalidrawElement[]
  files: BinaryFiles
}

export enum RequestTypes {
  access = 'access',
}

export type AccessRequestData = {
  type: RequestTypes.access
  metaData: {
    userId: string
    userName: string
  }
}
type RequestBase = {
  id: string
  date: string
}

export type AccessRequestEntity = AccessRequestData & RequestBase

const useBoardRoom = () => {
  const { updateUserData, getUserData } = useFirestoreUser()
  const { updateDocField, getSingleCollectionItem } = useFirestore()
  const { createNotification } = useNotifications()

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

  const getBoardInitialData = (boardId: string) => {
    return getSingleCollectionItem<BoardContentEntity>({
      collectionId: 'boardsContent',
      id: boardId,
    }).then((initialData) => {
      return {
        elements: deserializeFbaseToExc(initialData.elements),
        files: initialData.files,
      }
    })
  }

  const createAccessRequest = (
    board: BoardEntity,
    user: UserEntity,
    requestData: AccessRequestData,
  ) => {
    const request: AccessRequestEntity = {
      ...requestData,
      id: uuidv4(),
      date: 'now',
    }

    return getSingleCollectionItem<BoardEntity>({ id: board.boardId, collectionId: 'boards' }).then(
      (boardData) => {
        const alreadyAskForAccess = boardData.requests.find(
          (existedRequest) => existedRequest.metaData.userId === requestData.metaData.userId,
        )
        if (requestData.type === RequestTypes.access && boardData && alreadyAskForAccess) {
          throw new Error('Already asked access request')
        }

        return updateDocField({
          collectionId: 'boards',
          id: board.boardId,
          data: {
            requests: arrayUnion(request),
          },
        })
          .then(() => {
            const notificationData = {
              type: NotificationTypes.request,
              message: `User ${user.firstName} (${user.email}) ask for access to board (${board.boardName})`,
            }
            return createNotification(board.creatorId, notificationData).then(
              () => 'The owner of the board got a request for access',
            )
          })
          .catch((reason) => reason.message || 'we could not send a request for access')
      },
    )
  }

  const removeRequest = (boardId: string, removedRequest: AccessRequestEntity) => {
    return updateDocField({
      id: boardId,
      collectionId: 'boards',
      data: { requests: arrayRemove(removedRequest) },
    })
  }

  return { joinRoom, leaveRoom, getBoardInitialData, createAccessRequest, removeRequest }
}

export default useBoardRoom
