import useFirestoreUser from './useFirestoreUser'
import useFirestore from './useFirestore'
import { arrayUnion, arrayRemove, query, collection, where, getDocs } from 'firebase/firestore'
import { UserEntity } from '../providers/firebaseUserProvider'
import { db } from '../config/firebase'

const useBoardRoom = () => {
  const { updateUserData, getUserData } = useFirestoreUser()
  const { updateDocField, getSingleCollectionItem } = useFirestore()

  const joinRoom = (roomId: string, userId: string) => {
    return getSingleCollectionItem({ collectionId: 'boards', id: roomId }).then((board) => {
      if (board.users.find((user: { id: string }) => user.id === userId)) {
        return board
      } else {
        return getUserData(userId).then((userData) => {
          return updateDocField({
            collectionId: 'boards',
            id: roomId,
            data: {
              ...board,
              users: arrayUnion({
                name: userData.firstName,
                id: userData.id,
                creator: false,
              }),
            },
          }).then(() => {
            return updateUserData(userId, {
              userBoards: [...userData.userBoards, roomId],
            }).then(() => board)
          })
        })
      }
    })
  }

  const addUserToBoardByEmail = (userEmail: string) => {
    return new Promise<UserEntity>((resolve, reject) => {
      const q = query(collection(db, 'users'), where('email', '==', userEmail))

      getDocs(q)
        .then((querySnapshot) => {
          let data = null
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            data = doc.data()
          })

          data ? resolve(data) : reject(new Error('no user'))
        })
        .catch(() => reject(new Error('no user')))
    })
  }

  const leaveRoom = (roomId: string, userId: string) => {
    return getSingleCollectionItem({ collectionId: 'boards', id: roomId }).then((board) => {
      if (board.users.find((user: { id: string }) => user.id === userId)) {
        return getUserData(userId).then((userData) => {
          return updateDocField({
            collectionId: 'boards',
            id: roomId,
            data: {
              ...board,
              users: arrayRemove({
                name: userData.firstName,
                id: userData.id,
                creator: false,
              }),
            },
          }).then(() => {
            return updateUserData(userId, {
              userBoards: arrayRemove(roomId) as unknown as string[],
            }).then(() => true)
          })
        })
      } else {
        throw new Error('User not found in board list')
      }
    })
  }

  return { joinRoom, addUserToBoardByEmail, leaveRoom }
}

export default useBoardRoom
