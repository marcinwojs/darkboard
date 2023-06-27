import useFirestore from './useFirestore'
import { useUserContext } from '../providers/firebaseUserProvider'
import useFirestoreUser from './useFirestoreUser'
import humanId from 'human-id'
import { BoardEntity } from '../pages/boards/components/boardTable/boardTable'
import { convertFromDateObject, serializeExcToFbase } from '../shared/utils'
import { BoardsTemplatesKeys, boardTemplates } from '../templates/templates'

export type NewBoardProps = {
  boardName: string
  description: string
  privateBoard: boolean
  template: BoardsTemplatesKeys
}

const useCreateBoard = () => {
  const { updateUserData, getUserData } = useFirestoreUser()
  const { addToDoc } = useFirestore()
  const instanceId = humanId()
  const { user, setUser } = useUserContext()

  const createBoard = ({ boardName, description, template }: NewBoardProps) => {
    return new Promise(function (myResolve, myReject) {
      const data: BoardEntity = {
        boardId: instanceId,
        creatorId: user?.id || '',
        boardName,
        description,
        lastEdit: convertFromDateObject(new Date()),
        users: [{ name: user?.firstName || '', id: user?.id || '' }],
        requests: [],
      }

      return addToDoc({
        collectionId: 'boards',
        data,
        id: instanceId,
      })
        .then(() => {
          addToDoc({
            collectionId: 'boardsContent',
            id: instanceId,
            data: {
              elements:
                template === BoardsTemplatesKeys.blank
                  ? []
                  : serializeExcToFbase(boardTemplates[template].initialElements),
              files: {},
            },
          })
            .then(() => {
              getUserData(user?.id || '')
                .then((data) => {
                  const newUserData = data
                  newUserData.userBoards.push(instanceId)
                  updateUserData(user?.id || '', newUserData)
                    .then(() => {
                      setUser(newUserData)
                      myResolve(instanceId)
                    })
                    .catch((reason) => myReject(reason))
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
