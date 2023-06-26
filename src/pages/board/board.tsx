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
  const [error, setError] = useState('')
  const { getSingleCollectionItem } = useFirestore()
  const { user } = useUserContext()
  const { joinRoom } = useBoardRoom()
  const instanceId = useParams()?.boardId as string

  const fetchBoardData = async () => {
    if (user)
      try {
        const board = await getSingleCollectionItem<BoardEntity>({
          collectionId: 'boards',
          id: instanceId,
        })
        setBoardData(board || null)
        const accessToBoard = user.userBoards.includes(board.boardId)

        if (accessToBoard) {
          try {
            await joinRoom(board, user.id)
            const data = await getSingleCollectionItem<BoardContentEntity>({
              collectionId: 'boardsContent',
              id: instanceId,
            })
            setInitData({ elements: deserializeFbaseToExc(data.elements), files: data.files })
          } catch (error) {
            setLoaded(true)
            setError('We could not download board data')
          }
        }

        setAllowJoin(accessToBoard)
        setLoaded(true)
      } catch (error) {
        setLoaded(true)
        setError('Board not found')
      }
  }

  useEffect(() => {
    setError('')
    fetchBoardData()

    return () => {
      setError('')
      setLoaded(false)
      setBoardData(null)
      setInitData(null)
      setAllowJoin(false)
    }
  }, [user])

  if (!loaded) {
    return (
      <Stack m={10} spacing={2}>
        <Typography textAlign={'center'}>Loading...</Typography>
        <LinearProgress />
      </Stack>
    )
  }

  if ((loaded && error) || !boardData || !user) {
    return (
      <Stack m={10} spacing={2}>
        <Typography fontSize={'200px'} textAlign={'center'}>
          404
        </Typography>
        <Typography variant={'h4'} textAlign={'center'}>
          Error
        </Typography>
        <Typography textAlign={'center'}>{error}</Typography>
      </Stack>
    )
  }

  if (loaded && !allowJoin) {
    return <AskAccessView board={boardData} user={user} />
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
