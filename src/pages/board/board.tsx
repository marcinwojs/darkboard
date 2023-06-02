import useBoardRoom from '../../hooks/useBoardRoom'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types'
import useFirestore from '../../hooks/useFirestore'
import { LinearProgress, Stack, Typography } from '@mui/material'
import ExcalidrawBoard from './components/excalidrawBoard/excalidrawBoard'
import { useUserContext } from '../../providers/firebaseUserProvider'
import { deserializeFbaseToExc } from '../../shared/utils'

const Board = () => {
  const { joinRoom } = useBoardRoom()
  const instanceId = useParams()?.boardId as string
  const [initData, setInitData] = useState<ExcalidrawInitialDataState | null>(null)
  const { getSingleCollectionItem } = useFirestore()
  const { user } = useUserContext()

  useEffect(() => {
    if (user) joinRoom(instanceId, user?.id)
  }, [user])

  useEffect(() => {
    getSingleCollectionItem({ collectionId: 'boardsContent', id: instanceId }).then((data) => {
      setInitData({ elements: deserializeFbaseToExc(data.elements), files: data.files })
    })
  }, [])

  if (initData && user) {
    return <ExcalidrawBoard instanceId={instanceId} user={user} {...initData} />
  }

  return (
    <Stack m={10} spacing={2}>
      <Typography textAlign={'center'}>Loading...</Typography>
      <LinearProgress />
    </Stack>
  )
}

export default Board
