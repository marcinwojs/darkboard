import useFirestore from './useFirestore'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../config/firebase'

export type UserEntity = {
  email: string
  firstName: string
  id: string
  userBoards: string[]
}

const useFirestoreUser = () => {
  const { addToDoc, getSingleCollectionItem } = useFirestore()

  const getUserData = (userId: string) => {
    return getSingleCollectionItem<UserEntity>({ collectionId: 'users', id: userId })
  }

  const updateUserData = (id: string, userData: Partial<UserEntity>) => {
    return updateDoc(doc(db, 'users', id), userData)
  }

  const addUser = (userData: UserEntity) => {
    return addToDoc({ collectionId: 'users', id: userData.id, data: userData })
  }

  const getUserDataByEmail = (userEmail: string) => {
    return new Promise<UserEntity>((resolve, reject) => {
      const q = query(collection(db, 'users'), where('email', '==', userEmail))

      getDocs(q)
        .then((querySnapshot) => {
          let data = null
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            data = doc.data()
          })

          data ? resolve(data) : reject(new Error('no user'))
        })
        .catch(() => reject(new Error('no user')))
    })
  }

  return { getUserData, updateUserData, addUser, getUserDataByEmail }
}

export default useFirestoreUser
