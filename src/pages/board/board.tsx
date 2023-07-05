import useBoardRoom from '../../hooks/useBoardRoom'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types'
import { LinearProgress, Stack, Typography } from '@mui/material'
import ExcalidrawBoard from './components/excalidrawBoard/excalidrawBoard'
import { useUserContext } from '../../providers/firebaseUserProvider'
import { BoardEntity } from '../boards/components/boardTable/boardTable'
import { rectNotesList } from '../../libraries/stickyNotes/rectNote'
import { colorNotesList } from '../../libraries/stickyNotes/colorNote'
import AskAccessView from './components/askAccess/askAccessView'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../config/firebase'

const Board = () => {
  const [loaded, setLoaded] = useState(false)
  const [initData, setInitData] = useState<ExcalidrawInitialDataState | null>(null)
  const [boardData, setBoardData] = useState<BoardEntity | null>(null)
  const [allowJoin, setAllowJoin] = useState(false)
  const [error, setError] = useState('')
  const { user } = useUserContext()
  const { getBoardElements, getBoardFiles } = useBoardRoom()
  const instanceId = useParams()?.boardId as string
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, `boards/${instanceId}`), (doc) => {
        const board = doc.data() as BoardEntity

        if (board) {
          setBoardData(board || null)
          const accessToBoard = user.userBoards.includes(board.boardId)

          if (accessToBoard) {
            getBoardElements(instanceId).then((elements) => {
              getBoardFiles(instanceId).then((files) => setInitData({ elements, files }))
            })
          }

          setAllowJoin(accessToBoard)
        } else {
          setError('Board not found')
        }
        setLoaded(true)
      })

      return () => {
        unsubscribe()
      }
    }
  }, [user])

  useEffect(() => {
    if (loaded && error) {
      navigate('/404')
    }
  }, [loaded, error])

  if (loaded && !allowJoin && boardData && user) {
    return <AskAccessView board={boardData} user={user} />
  }

  if (!loaded || !boardData || !user || !initData) {
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
