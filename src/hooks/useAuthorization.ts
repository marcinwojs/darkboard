import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import useFirestore from './useFirestore'
import { UserEntity } from './useFirestoreUser'

type SignIn = {
  email: string
  password: string
}

type SignUp = SignIn & {
  firstName: string
}

const UseAuthorization = () => {
  const { addToDoc } = useFirestore()
  const signIn = ({ email, password }: SignIn) => signInWithEmailAndPassword(auth, email, password)
  const signUp = ({ email, password, firstName }: SignUp) => {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const data: UserEntity = {
        email: email,
        firstName: firstName,
        id: userCredential.user.uid,
        userBoards: [],
      }
      return addToDoc({
        collectionId: 'users',
        data,
        id: data.id,
      })
    })
  }

  const logout = () => signOut(auth)

  return { signIn, signUp, logout }
}

export default UseAuthorization
