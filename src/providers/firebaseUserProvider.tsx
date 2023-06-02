import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import useFirestore from '../hooks/useFirestore'

export type UserEntity = {
  firstName: string
  id: string
  email: string
  photo?: string
  userBoards: string[]
}

export type FirebaseUserContextType = {
  user: UserEntity | null
  loaded: boolean
  setUser: (data: UserEntity | null) => void
}

export const FirebaseUserContext = createContext<FirebaseUserContextType>({
  loaded: false,
  user: null,
  setUser: () => null,
})

export const useUserContext = () => useContext<FirebaseUserContextType>(FirebaseUserContext)

const FirebaseUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserEntity | null>(null)
  const [loaded, setLoaded] = useState(false)
  const { getSingleCollectionItem } = useFirestore()

  useEffect(() => {
    onAuthStateChanged(auth, (userData) => {
      if (!userData) {
        setUser(null)
        setLoaded(true)
        return
      }
      getSingleCollectionItem({ collectionId: 'users', id: userData.uid }).then((data) => {
        if (userData?.providerData[0].providerId === 'password') {
          if (data) setUser(data as UserEntity)
          setLoaded(true)
          return
        }
        setUser({
          ...(data as UserEntity),
          photo: userData.photoURL || undefined,
        })
        if (data) setUser(data as UserEntity)
        setLoaded(true)
      })
    })
  }, [])

  return (
    <FirebaseUserContext.Provider value={{ user, loaded, setUser }}>
      {children}
    </FirebaseUserContext.Provider>
  )
}

export default FirebaseUserProvider
