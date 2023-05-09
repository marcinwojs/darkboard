import { collection, setDoc, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

type AddToDoc = {
  collectionId: string
  data: { [key: string]: any }
  id: string
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
      if (data === null || data === undefined) return null
      return data
    })
  }

  return { getCollection, addToDoc, getSingleCollectionItem }
}

export default UseFirestore
