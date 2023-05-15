import { createContext, FC, ReactNode, useEffect, useState } from 'react'
import { UserEntity } from '../pages/home/components/userList'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import useFirestore from '../hooks/useFirestore'
import {useNavigate} from 'react-router-dom';

export type FirebaseUserContextType = {
  user: UserEntity | null
  setUser: (data: UserEntity | null) => void
}

export const FirebaseUserContext = createContext<FirebaseUserContextType | null>(null)

const FirebaseUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserEntity | null>(null)
  const { getSingleCollectionItem } = useFirestore()

  useEffect(() => {
    onAuthStateChanged(auth, (userData) => {
      if (userData) {
        if (userData?.providerData[0].providerId === 'password') {
          return getSingleCollectionItem({ collectionId: 'users', id: userData.uid }).then(
            (data) => {
              if (data) setUser(data as UserEntity)
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
        // navigate('/')
        console.log('user is logged out')
      }
    })
  }, [])


  return (
    <FirebaseUserContext.Provider value={{ user, setUser }}>
      {children}
    </FirebaseUserContext.Provider>
  )
}

export default FirebaseUserProvider
