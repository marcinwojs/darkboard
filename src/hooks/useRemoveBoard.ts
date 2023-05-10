import useFirestore from './useFirestore'

const useRemoveBoard = () => {
  const { removeFromDoc } = useFirestore()

  const removeBoard = (id: string) => {
    return new Promise(function (myResolve, myReject) {
      return removeFromDoc({
        collectionId: 'boards',
        id,
      })
        .then(() => {
          myResolve(true)
        })
        .catch((reason) => myReject(reason))
    })
  }

  return { removeBoard }
}

export default useRemoveBoard
