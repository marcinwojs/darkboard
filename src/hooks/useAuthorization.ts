import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { UserEntity } from './useFirestoreUser'
import { doc, writeBatch } from 'firebase/firestore'

type SignIn = {
  email: string
  password: string
}

type SignUp = SignIn & {
  firstName: string
}

const UseAuthorization = () => {
  const signIn = ({ email, password }: SignIn) => signInWithEmailAndPassword(auth, email, password)
  const signUp = async ({ email, password, firstName }: SignUp) => {
    return createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const data: UserEntity = {
        email: email,
        firstName: firstName,
        id: userCredential.user.uid,
        userBoards: [],
        photo: '',
      }

      const batch = writeBatch(db)

      const newUserRef = doc(db, `users/${data.id}`)
      batch.set(newUserRef, data)

      const newNotificationsRef = doc(db, `notifications/${data.id}`)
      batch.set(newNotificationsRef, { notifications: [] })

      return await batch.commit()
    })
  }

  const logout = () => signOut(auth)

  return { signIn, signUp, logout }
}

export default UseAuthorization
