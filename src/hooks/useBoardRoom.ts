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
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'

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
  const { getUserData } = useFirestoreUser()
  const { getSingleCollectionItem } = useFirestore()

  const joinRoom = async (boardId: string, userId: string) => {
    const { id, firstName } = await getUserData(userId)

    if (id) {
      const batch = writeBatch(db)

      const boardRef = doc(db, `boards/${boardId}`)
      batch.update(boardRef, { users: arrayUnion({ id, name: firstName }) })

      const newBoardUserRef = doc(db, `users/${userId}`)
      batch.update(newBoardUserRef, { userBoards: arrayUnion(boardId) })

      return await batch.commit().then(() => 'The owner of the board got a request for access')
    } else {
      throw new Error('error')
    }
  }

  const leaveRoom = async (boardId: string, userData: { id: string; name: string }) => {
    const batch = writeBatch(db)

    const boardRef = doc(db, `boards/${boardId}`)
    batch.update(boardRef, { users: arrayRemove(userData) })

    const userRef = doc(db, `users/${userData.id}`)
    batch.update(userRef, { userBoards: arrayRemove(boardId) })

    return await batch.commit().then(() => 'The owner of the board got a request for access')
  }

  const getBoardElements = (boardId: string) => {
    return getSingleCollectionItem<{ elements: BoardContentEntity['elements'] }>({
      collectionId: `boards/${boardId}/boardContent`,
      id: 'elements',
    }).then(({ elements }) => elements)
  }

  const getBoardFiles = (boardId: string) => {
    return getSingleCollectionItem<{ files: BoardContentEntity['files'] }>({
      collectionId: `boards/${boardId}/boardContent`,
      id: 'files',
    }).then(({ files }) => files)
  }

  const getInitialData = (
    boardId: string,
  ): Promise<{ files: BinaryFiles; elements: ExcalidrawElement[] }> => {
    const elements = getBoardElements(boardId)
    const files = getBoardFiles(boardId)

    return Promise.all([elements, files]).then((data) => ({
      elements: data[0],
      files: data[1],
    }))
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

      const requestRef = doc(db, `boards/${boardId}/requests/${requestId}`)
      batch.set(requestRef, request)

      const notificationsRef = doc(db, `notifications/${creatorId}`)
      batch.update(notificationsRef, { notifications: arrayUnion(notification) })

      return await batch.commit().then(() => 'The owner of the board got a request for access')
    }
  }

  const acceptAccessRequest = (
    boardId: string,
    requestId: string,
    userData: {
      userId: string
      userName: string
    },
  ) => {
    joinRoom(boardId, userData.userId).then(() => removeRequest(boardId, requestId))
  }

  const removeRequest = (boardId: string, requestId: string) => {
    return deleteDoc(doc(db, `boards/${boardId}/requests`, requestId))
  }

  return {
    joinRoom,
    leaveRoom,
    getBoardElements,
    getInitialData,
    getBoardFiles,
    createAccessRequest,
    acceptAccessRequest,
    removeRequest,
  }
}

export default useBoardRoom
