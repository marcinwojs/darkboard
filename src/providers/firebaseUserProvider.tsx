import {createContext, FC, ReactNode, useContext, useEffect, useState} from 'react'
import { UserEntity } from '../pages/home/components/userList'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import useFirestore from '../hooks/useFirestore'

export type FirebaseUserContextType = {
  user: UserEntity | null
  loaded: boolean
  setUser: (data: UserEntity | null) => void
}

export const FirebaseUserContext = createContext<FirebaseUserContextType>({
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
      if (userData) {
        if (userData?.providerData[0].providerId === 'password') {
          return getSingleCollectionItem({ collectionId: 'users', id: userData.uid }).then(
            (data) => {
              if (data) setUser(data as UserEntity)
              setLoaded(true)
            },
          )
        }
        setUser({
          firstName: userData.displayName || '',
          email: userData.email || '',
          photo: userData.photoURL || undefined,
          id: userData.uid,
        })
      } else {
        setUser(null)
        console.log('user is logged out')
      }
      setLoaded(true)
    })
  }, [])

  return (
    <FirebaseUserContext.Provider value={{ user, loaded, setUser }}>
      {children}
    </FirebaseUserContext.Provider>
  )
}

export default FirebaseUserProvider
