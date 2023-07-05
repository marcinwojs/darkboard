import { arrayRemove, doc, writeBatch } from 'firebase/firestore'
import { db } from '../config/firebase'

const useRemoveBoard = () => {
  const removeBoard = async (userId: string, boardId: string) => {
    const batch = writeBatch(db)

    const nycRef = doc(db, `boards/${boardId}`)
    batch.delete(nycRef)

    const boardCreator = doc(db, `users/${userId}`)
    batch.update(boardCreator, { userBoards: arrayRemove(boardId) })

    return await batch.commit()
  }

  return { removeBoard }
}

export default useRemoveBoard
