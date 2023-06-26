import useBoardRoom, { BoardContentEntity } from '../../hooks/useBoardRoom'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types'
import useFirestore from '../../hooks/useFirestore'
import { Button, LinearProgress, Stack, Typography } from '@mui/material'
import ExcalidrawBoard from './components/excalidrawBoard/excalidrawBoard'
import { useUserContext } from '../../providers/firebaseUserProvider'
import { deserializeFbaseToExc } from '../../shared/utils'
import { BoardEntity } from '../boards/components/boardTable/boardTable'
import { rectNotesList } from '../../libraries/stickyNotes/rectNote'
import { colorNotesList } from '../../libraries/stickyNotes/colorNote'
import { Add } from '@mui/icons-material'

const Board = () => {
  const { joinRoom } = useBoardRoom()
  const instanceId = useParams()?.boardId as string
  const [initData, setInitData] = useState<ExcalidrawInitialDataState | null>(null)
  const [boardData, setBoardData] = useState<BoardEntity | null>(null)
  const [allowJoin, setAllowJoin] = useState(false)
  const { getSingleCollectionItem } = useFirestore()
  const { user } = useUserContext()

  useEffect(() => {
    getSingleCollectionItem<BoardEntity>({ collectionId: 'boards', id: instanceId }).then(
      (data) => {
        let access = false
        if (user && data.privateBoard) {
          access = (data?.privateBoard && user.userBoards.includes(data.boardId)) || false
        }
        setBoardData((data as BoardEntity) || null)

        if (user && access) {
          joinRoom(instanceId, user.id)
          setAllowJoin(true)
          getSingleCollectionItem<BoardContentEntity>({
            collectionId: 'boardsContent',
            id: instanceId,
          }).then((data) => {
            setInitData({ elements: deserializeFbaseToExc(data.elements), files: data.files })
          })
        }
      },
    )
  }, [user])

  if (boardData && !allowJoin) {
    return (
      <Stack m={10} spacing={2}>
        <Typography>Ask request for board access</Typography>
        <Button startIcon={<Add />}>Ask for request</Button>
      </Stack>
    )
  }

  if (!(initData && user && boardData)) {
    return (
      <Stack m={10} spacing={2}>
        <Typography textAlign={'center'}>Loading...</Typography>
        <LinearProgress />
      </Stack>
    )
  }

  return (
    <ExcalidrawBoard
      instanceId={instanceId}
      user={user}
      {...initData}
      boardData={boardData}
      libraryItems={[...colorNotesList, ...rectNotesList]}
    />
  )
}

export default Board
