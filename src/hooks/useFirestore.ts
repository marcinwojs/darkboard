import {
  collection,
  setDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../config/firebase'

type RemoveFromDoc = {
  collectionId: string
  id: string
}

type AddToDoc = RemoveFromDoc & {
  data: { [key: string]: any }
}

type GetCollection = {
  collectionId: string
}
type GetSingleCollectionItem = GetCollection & {
  id: string
}
const UseFirestore = () => {
  const addToDoc = ({ data, collectionId, id }: AddToDoc) =>
    setDoc(doc(collection(db, collectionId), id), data)

  const updateDocField = ({ data, collectionId, id }: AddToDoc) =>
    updateDoc(doc(db, collectionId, id), data)

  const removeFromDoc = ({ collectionId, id }: RemoveFromDoc) =>
    deleteDoc(doc(collection(db, collectionId), id))

  const getCollection = ({ collectionId }: GetCollection) => {
    return getDocs(collection(db, collectionId)).then((docRefs) => {
      const res: any[] = []

      docRefs.forEach((item) => {
        res.push({
          ...item.data(),
        })
      })
      return res
    })
  }

  const getSingleCollectionItem = ({ collectionId, id }: GetSingleCollectionItem) => {
    const docRef = doc(db, collectionId, id)
    return getDoc(docRef).then((docSnap) => {
      const data = docSnap.exists() ? docSnap.data() : null
      if (data === null || data === undefined) throw new Error('No data in database')
      return data
    })
  }

  function subToData<T>(collectionId: string, id: string, callback: (data: T) => void) {
    onSnapshot(doc(db, collectionId, id), (doc) => {
      return callback(doc.data() as T)
    })
  }

  return {
    getCollection,
    addToDoc,
    updateDocField,
    removeFromDoc,
    getSingleCollectionItem,
    subToData,
  }
}

export default UseFirestore
