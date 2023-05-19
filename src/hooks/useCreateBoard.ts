import useFirestore from './useFirestore'
import { useUserContext } from '../providers/firebaseUserProvider'
import useFirestoreUser from './useFirestoreUser'
import humanId from 'human-id'

type NewBoardProps = {
  boardName: string
}

const useCreateBoard = () => {
  const { updateUserData, getUserData } = useFirestoreUser()
  const { addToDoc } = useFirestore()
  const instanceId = humanId()
  const { user } = useUserContext()

  const createBoard = ({ boardName }: NewBoardProps) => {
    return new Promise(function (myResolve, myReject) {
      const data = {
        boardName: boardName,
        boardId: instanceId,
        creatorId: user?.id,
        users: [{ name: user?.firstName || '', id: user?.id || '', creator: true }],
      }

      return addToDoc({
        collectionId: 'boards',
        data,
        id: instanceId,
      })
        .then(() => {
          addToDoc({ collectionId: 'boardsContent', id: instanceId, data: { elements: [] } })
            .then(() => {
              getUserData(user?.id || '')
                .then((data) => {
                  const newUserData = data
                  newUserData.userBoards.push({ id: instanceId, name: boardName, own: true })
                  updateUserData(user?.id || '', newUserData)
                    .then(() => {
                      myResolve(instanceId)
                    })
                    .catch((reason: any) => myReject(reason))
                })
                .catch((reason) => myReject(reason))
            })
            .catch((reason) => myReject(reason))
        })
        .catch((reason) => myReject(reason))
    })
  }

  return { createBoard }
}

export default useCreateBoard
