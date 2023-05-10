import { TLInstance } from '@tldraw/tldraw'
import useFirestore from './useFirestore'
import { useContext } from 'react'
import { FirebaseUserContext, FirebaseUserContextType } from '../providers/firebaseUserProvider'

type NewBoardProps = {
  boardName: string
}

const useCreateBoard = () => {
  const { addToDoc } = useFirestore()
  const instanceId = TLInstance.createId()
  const { user } = useContext(FirebaseUserContext) as FirebaseUserContextType

  const createBoard = ({ boardName }: NewBoardProps) => {
    return new Promise(function (myResolve, myReject) {
      const data = {
        boardName: boardName,
        boardId: instanceId,
        creatorId: user?.id,
        records: [],
      }

      return addToDoc({
        collectionId: 'boards',
        data,
        id: instanceId,
      })
        .then(() => {
          myResolve(instanceId)
        })
        .catch((reason) => myReject(reason))
    })
  }

  return { createBoard }
}

export default useCreateBoard
