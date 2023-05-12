import { TLInstanceId } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import { useEffect, useState } from 'react'
import useFirestore from '../../hooks/useFirestore'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Excalidraw } from '@excalidraw/excalidraw'
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { throttle } from 'lodash'

export function Board({ elements }: ExcalidrawInitialDataState) {
  const instanceId = useParams()?.boardId as TLInstanceId
  const { addToDoc } = useFirestore()

  const onChange = (elements: readonly ExcalidrawElement[]) => {
    throttle(() => {
      addToDoc({
        collectionId: 'boardsContent',
        data: { elements },
        id: instanceId,
      })
    }, 100)()
  }

  return (
    <Box width={'100%'} height={'100%'}>
      <Excalidraw initialData={{ elements }} onChange={(elements) => onChange(elements)} />
    </Box>
  )
}

const LoadBoard = () => {
  const instanceId = useParams()?.boardId as TLInstanceId
  const [elements, setElements] = useState<ExcalidrawInitialDataState['elements'] | null>(null)
  const { getSingleCollectionItem } = useFirestore()

  useEffect(() => {
    getSingleCollectionItem({ collectionId: 'boardsContent', id: instanceId }).then((data) => {
      setElements(data?.elements)
    })
  }, [])

  return elements ? (
    <Board elements={elements} />
  ) : (
    <Stack m={10} spacing={2}>
      <Typography textAlign={'center'}>Loading...</Typography>
      <LinearProgress />
    </Stack>
  )
}

export default LoadBoard
