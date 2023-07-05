import useFirestoreUser from './useFirestoreUser'
import useFirestore from './useFirestore'
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
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

  const joinRoom = async (boardId: string, userId: string) => {
    const { id, firstName } = await getUserData(userId)

    if (id) {
      const batch = writeBatch(db)

      const nycRef = doc(db, `boards/${boardId}`)
      batch.update(nycRef, { users: arrayUnion({ id, name: firstName }) })

      const boardCreator = doc(db, `users/${userId}`)
      batch.update(boardCreator, { userBoards: arrayUnion(boardId) })

      return await batch.commit().then(() => 'The owner of the board got a request for access')
    } else {
      throw new Error('error')
    }
  }

  const leaveRoom = async (boardId: string, userData: { id: string; name: string }) => {
    const batch = writeBatch(db)

    const nycRef = doc(db, `boards/${boardId}`)
    batch.update(nycRef, { users: arrayRemove(userData) })

    const boardCreator = doc(db, `users/${userData.id}`)
    batch.update(boardCreator, { userBoards: arrayRemove(boardId) })

    return await batch.commit().then(() => 'The owner of the board got a request for access')
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

  const acceptAccessRequest = async (
    boardId: string,
    requestId: string,
    userData: {
      userId: string
      userName: string
    },
  ) => {
    try {
      await joinRoom(boardId, userData.userId).then(() => removeRequest(boardId, requestId))
    } catch (exceptionVar) {
      console.log('fail')
    }
  }

  const removeRequest = (boardId: string, requestId: string) => {
    return deleteDoc(doc(db, `boards/${boardId}/requests`, requestId))
  }

  return {
    joinRoom,
    leaveRoom,
    getBoardElements,
    getBoardFiles,
    createAccessRequest,
    acceptAccessRequest,
    removeRequest,
  }
}

export default useBoardRoom
