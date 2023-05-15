import useFirestore from './useFirestore'
import { collection, doc, setDoc, addDoc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export type UserBoardEntity = { id: string; name: string; own: boolean }

export type UserEntity = {
  email: string
  firstName: string
  id: string
  userBoards: UserBoardEntity[]
}

const useFirestoreUser = () => {
  const { addToDoc, getSingleCollectionItem } = useFirestore()

  const getUserData = (userId: string) => {
    return getSingleCollectionItem({ collectionId: 'users', id: userId }).then(
      (data) => data as UserEntity,
    )
  }

  const updateUserData = (id: string, userData: Partial<UserEntity>) => {
    return updateDoc(doc(db, 'users', id), userData)
  }

  const addUser = (userData: UserEntity) => {
    return addToDoc({ collectionId: 'users', id: userData.id, data: userData })
  }

  return { getUserData, updateUserData, addUser }
}

export default useFirestoreUser
