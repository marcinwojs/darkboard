import useFirestoreUser from './useFirestoreUser'
import useFirestore from './useFirestore'
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { BoardEntity } from '../pages/boards/components/boardTable/boardTable'
import { SerializedExcalidrawElement } from '../pages/board/components/excalidrawBoard/excalidrawBoard'
import { BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { v4 as uuidv4 } from 'uuid'
import { convertFromDateObject } from '../shared/utils'
import { NotificationTypes } from './useNotifications'
import { UserEntity } from '../providers/firebaseUserProvider'
import { db } from '../config/firebase'

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
  date: { seconds: number; nanoseconds: number }
}

export type AccessRequestEntity = AccessRequestData & RequestBase

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

  const getBoardElements = (boardId: string) => {
    return getSingleCollectionItem<{ elements: BoardContentEntity['elements'] }>({
      collectionId: `boards/${boardId}/boardContent`,
      id: 'elements',
    }).then(({ elements }) => {
      return elements
    })
  }
  const getBoardFiles = (boardId: string) => {
    return getSingleCollectionItem<{ files: BoardContentEntity['files'] }>({
      collectionId: `boards/${boardId}/boardContent`,
      id: 'files',
    }).then(({ files }) => {
      return files
    })
  }

  const createAccessRequest = async (
    board: BoardEntity,
    user: UserEntity,
    requestData: AccessRequestData,
  ) => {
    const { boardId, boardName, creatorId } = board
    const requestId = uuidv4()
    const currentDate = convertFromDateObject(new Date())
    const request: AccessRequestEntity = {
      ...requestData,
      id: requestId,
      date: currentDate,
    }
    const notification = {
      type: NotificationTypes.request,
      message: `User ${user.firstName} (${user.email}) ask for access to board (${boardName})`,
      id: uuidv4(),
      date: convertFromDateObject(new Date()),
      isRead: false,
    }

    const q = query(
      collection(db, `boards/${boardId}/requests`),
      where('metaData.userId', '==', user.id),
    )
    const querySnapshot = await getDocs(q)

    const alreadyCreatedAccess = Boolean(querySnapshot.size)

    if (alreadyCreatedAccess) {
      throw new Error('Already asked access request')
    } else {
      const batch = writeBatch(db)

      const nycRef = doc(db, `boards/${boardId}/requests/${requestId}`)
      batch.set(nycRef, request)

      const boardCreator = doc(db, `notifications/${creatorId}`)
      batch.update(boardCreator, { notifications: arrayUnion(notification) })

      return await batch.commit().then(() => 'The owner of the board got a request for access')
    }
  }

  const removeRequest = (boardId: string, removedRequest: AccessRequestEntity) => {
    return updateDocField({
      id: boardId,
      collectionId: 'boards',
      data: { requests: arrayRemove(removedRequest) },
    })
  }

  return {
    joinRoom,
    leaveRoom,
    getBoardElements,
    getBoardFiles,
    createAccessRequest,
    removeRequest,
  }
}

export default useBoardRoom
