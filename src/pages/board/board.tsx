import useBoardRoom from '../../hooks/useBoardRoom'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types'
import useFirestore from '../../hooks/useFirestore'
import { LinearProgress, Stack, Typography } from '@mui/material'
import ExcalidrawBoard from './components/excalidrawBoard/excalidrawBoard'
import { useUserContext } from '../../providers/firebaseUserProvider'
import { deserializeFbaseToExc } from '../../shared/utils'
import { BoardEntity } from '../boards/components/boardTable/boardTable'

const Board = () => {
  const { joinRoom } = useBoardRoom()
  const instanceId = useParams()?.boardId as string
  const [initData, setInitData] = useState<ExcalidrawInitialDataState | null>(null)
  const [boardData, setBoardData] = useState<BoardEntity | null>(null)
  const { getSingleCollectionItem } = useFirestore()
  const { user } = useUserContext()

  useEffect(() => {
    if (user) joinRoom(instanceId, user.id)
  }, [user])

  useEffect(() => {
    getSingleCollectionItem({ collectionId: 'boards', id: instanceId }).then((data) => {
      setBoardData((data as BoardEntity) || null)
    })
    getSingleCollectionItem({ collectionId: 'boardsContent', id: instanceId }).then((data) => {
      setInitData({ elements: deserializeFbaseToExc(data.elements), files: data.files })
    })
  }, [])

  if (!(initData && user && boardData)) {
    return (
      <Stack m={10} spacing={2}>
        <Typography textAlign={'center'}>Loading...</Typography>
        <LinearProgress />
      </Stack>
    )
  }

  return <ExcalidrawBoard instanceId={instanceId} user={user} {...initData} boardData={boardData} />
}

export default Board
