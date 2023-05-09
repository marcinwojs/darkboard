import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {
  firebaseApiKey,
  firebaseAppId,
  firebaseAuthDomain,
  firebaseDatabaseURL,
  firebaseMeasurementId,
  firebaseMessagingSenderId,
  firebaseProjectId,
  firebaseStorageBucket,
} from './appConfig'

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  databaseURL: firebaseDatabaseURL,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

const signInWithGoogle = () => signInWithPopup(auth, provider)

const db = getFirestore(app)

export { db, signInWithGoogle, auth }

export default app
