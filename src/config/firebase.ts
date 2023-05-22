import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
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
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'

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

connectAuthEmulator(auth, 'http://localhost:9099/')

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

const signInWithGoogle = () => signInWithPopup(auth, provider)

const db = getFirestore(app)
connectFirestoreEmulator(db, 'localhost', 8080)
const rdb = getDatabase(app)
connectDatabaseEmulator(rdb, 'localhost', 9000)

export { db, rdb, signInWithGoogle, auth }

export default app
