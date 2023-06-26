import useBoardRoom, { BoardContentEntity } from '../../hooks/useBoardRoom'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types'
import useFirestore from '../../hooks/useFirestore'
import { LinearProgress, Stack, Typography } from '@mui/material'
import ExcalidrawBoard from './components/excalidrawBoard/excalidrawBoard'
import { useUserContext } from '../../providers/firebaseUserProvider'
import { deserializeFbaseToExc } from '../../shared/utils'
import { BoardEntity } from '../boards/components/boardTable/boardTable'
import { rectNotesList } from '../../libraries/stickyNotes/rectNote'
import { colorNotesList } from '../../libraries/stickyNotes/colorNote'
import AskAccessView from './components/askAccess/askAccessView'

const Board = () => {
  const [loaded, setLoaded] = useState(false)
  const [initData, setInitData] = useState<ExcalidrawInitialDataState | null>(null)
  const [boardData, setBoardData] = useState<BoardEntity | null>(null)
  const [allowJoin, setAllowJoin] = useState(false)
  const { getSingleCollectionItem } = useFirestore()
  const { user } = useUserContext()
  const { joinRoom } = useBoardRoom()
  const instanceId = useParams()?.boardId as string

  useEffect(() => {
    if (user)
      getSingleCollectionItem<BoardEntity>({ collectionId: 'boards', id: instanceId }).then(
        (board) => {
          setBoardData(board || null)
          const accessToBoard = user.userBoards.includes(board.boardId)

          if (accessToBoard) {
            joinRoom(board, user.id).then(() =>
              getSingleCollectionItem<BoardContentEntity>({
                collectionId: 'boardsContent',
                id: instanceId,
              }).then((data) => {
                setInitData({ elements: deserializeFbaseToExc(data.elements), files: data.files })
              }),
            )
          }

          setAllowJoin(accessToBoard)
          setLoaded(true)
        },
      )
  }, [user])

  if (!loaded) {
    return (
      <Stack m={10} spacing={2}>
        <Typography textAlign={'center'}>Loading...</Typography>
        <LinearProgress />
      </Stack>
    )
  }

  if (loaded && !allowJoin && boardData && user) {
    return <AskAccessView board={boardData} user={user} />
  }

  return boardData && user ? (
    <ExcalidrawBoard
      instanceId={instanceId}
      user={user}
      {...initData}
      boardData={boardData}
      libraryItems={[...colorNotesList, ...rectNotesList]}
    />
  ) : null
}

export default Board
