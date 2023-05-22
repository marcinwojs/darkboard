import useFirestore from './useFirestore'
import useFirestoreUser from './useFirestoreUser'

const useRemoveBoard = () => {
  const { updateUserData, getUserData } = useFirestoreUser()
  const { removeFromDoc } = useFirestore()

  const removeBoard = (userId: string, id: string) => {
    return new Promise(function (myResolve, myReject) {
      return removeFromDoc({
        collectionId: 'boards',
        id,
      })
        .then(() => {
          getUserData(userId)
            .then((userData) => {
              updateUserData(userData.id, {
                userBoards: userData.userBoards.filter((boardId) => boardId !== id),
              })
            })
            .catch((reason) => myReject(reason))
          myResolve(true)
        })
        .catch((reason) => myReject(reason))
    })
  }

  return { removeBoard }
}

export default useRemoveBoard
