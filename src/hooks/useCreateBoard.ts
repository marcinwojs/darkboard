import { useUserContext } from '../providers/firebaseUserProvider'
import useFirestoreUser from './useFirestoreUser'
import humanId from 'human-id'
import { convertFromDateObject, serializeExcToFbase } from '../shared/utils'
import { BoardsTemplatesKeys, boardTemplates } from '../templates/templates'
import { doc, writeBatch } from 'firebase/firestore'
import { db } from '../config/firebase'

export type NewBoardProps = {
  boardName: string
  description: string
  template: BoardsTemplatesKeys
}

const useCreateBoard = () => {
  const { getUserData } = useFirestoreUser()
  const instanceId = humanId()
  const { user } = useUserContext()

  const createBoard = async ({ boardName, description, template }: NewBoardProps) => {
    const data = {
      boardId: instanceId,
      creatorId: user?.id || '',
      boardName,
      description,
      lastEdit: convertFromDateObject(new Date()),
      users: [{ name: user?.firstName || '', id: user?.id || '' }],
    }
    const boardsContent = {
      elements:
        template === BoardsTemplatesKeys.blank
          ? []
          : serializeExcToFbase(boardTemplates[template].initialElements),
      files: {},
    }

    const batch = writeBatch(db)

    const newBoardRef = doc(db, `boards/${instanceId}`)
    batch.set(newBoardRef, data)

    const elementsRef = doc(db, `boards/${instanceId}`, 'boardContent/elements')
    batch.set(elementsRef, { elements: boardsContent.elements })

    const filesRef = doc(db, `boards/${instanceId}`, 'boardContent/files')
    batch.set(filesRef, { files: boardsContent.files })

    const userData = await getUserData(user?.id || '')

    const userRef = doc(db, 'users', user?.id || '')
    batch.update(userRef, { userBoards: [...userData.userBoards, instanceId] })

    return await batch.commit().then(() => instanceId)
  }

  return { createBoard }
}

export default useCreateBoard
