import useFirestoreUser from './useFirestoreUser'
import useFirestore from './useFirestore'
import { arrayUnion } from 'firebase/firestore'

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
              userBoards: [
                ...userData.userBoards,
                { id: roomId, name: board.boardName, own: false },
              ],
            }).then(() => board)
          })
        })
      }
    })
  }

  return { joinRoom }
}

export default useBoardRoom
