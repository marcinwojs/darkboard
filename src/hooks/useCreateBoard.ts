import { TLInstance } from '@tldraw/tldraw'
import useFirestore from './useFirestore'
import { useContext } from 'react'
import { FirebaseUserContext, FirebaseUserContextType } from '../providers/firebaseUserProvider'
import useFirestoreUser from './useFirestoreUser'

type NewBoardProps = {
  boardName: string
}

const useCreateBoard = () => {
  const { updateUserData, getUserData } = useFirestoreUser()
  const { addToDoc } = useFirestore()
  const instanceId = TLInstance.createId()
  const { user } = useContext(FirebaseUserContext) as FirebaseUserContextType

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
