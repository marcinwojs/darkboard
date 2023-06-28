import useFirestore from './useFirestore'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db, str } from '../config/firebase'
import { fetchImage, setWithTransition } from '../shared/helpers/helpers'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export type UserEntity = {
  email: string
  firstName: string
  id: string
  userBoards: string[]
  photo?: string
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

  const changeUserPortrait = (
    userId: string,
    file: File,
    onLoading: (loading: boolean) => void,
    onProgress: (progress: number) => void,
    onError: (error: Error) => void,
  ) => {
    const uploadTask = uploadBytesResumable(ref(str, userId), file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress(progress)
        if (snapshot.state === 'running') {
          setWithTransition(() => onLoading(true))
        }
      },
      (error) => {
        onError(error)
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          await updateUserData(userId, { photo: url })

          fetchImage(url).then(() => setWithTransition(() => onLoading(false)))
        } catch (e) {
          onError(e as Error)
        }
      },
    )
  }

  return { getUserData, updateUserData, addUser, getUserDataByEmail, changeUserPortrait }
}

export default useFirestoreUser
