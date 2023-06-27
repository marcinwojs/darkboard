import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../config/firebase'
import useFirestore from '../hooks/useFirestore'
import { doc, onSnapshot } from 'firebase/firestore'

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

  useEffect(() => {
    onAuthStateChanged(auth, (userData) => {
      if (!userData) {
        setUser(null)
        setLoaded(true)
        return
      }

      onSnapshot(doc(db, 'users', userData.uid), (doc) => {
        const data = doc.data() as UserEntity

        if (userData?.providerData[0].providerId === 'password') {
          if (data) setUser(data)
          setLoaded(true)
          return
        }
        setUser({
          ...data,
          photo: userData.photoURL || undefined,
        })
        if (data) setUser(data)
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
