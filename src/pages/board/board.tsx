import { TLInstanceId } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import { useEffect, useState, useCallback } from 'react'
import useFirestore from '../../hooks/useFirestore'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Excalidraw } from '@excalidraw/excalidraw'
import {
  ExcalidrawAPIRefValue,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { throttle } from 'lodash'
import { default as SocketIOClient, io } from 'socket.io-client'
import { Socket } from 'net'

export function useCallbackRefState<T>() {
  const [refValue, setRefValue] = useState<T | null>(null)
  const refCallback = useCallback((value: T | null) => setRefValue(value), [])
  return [refValue, refCallback] as const
}

type Props = ExcalidrawInitialDataState & {
  socket: Socket
}

const socket = io('http://localhost:3002/')

export function Board({ elements, socket }: Props) {
  const instanceId = useParams()?.boardId as TLInstanceId
  const { addToDoc, subToData } = useFirestore()
  const [excalidrawAPI, excalidrawRefCallback] = useCallbackRefState<ExcalidrawImperativeAPI>()
  const [newsestChanges, setNewestChanges] = useState(true)

  useEffect(() => {
    if (excalidrawAPI && socket) {
      socket.on('client-change', (freshElements) => {
        excalidrawAPI?.updateScene({ elements: freshElements })
        setNewestChanges(true)
      })
    }
  })

  console.log(excalidrawAPI)
  const onChange = (elements: readonly ExcalidrawElement[]) => {
    throttle(() => {
      addToDoc({
        collectionId: 'boardsContent',
        data: { elements },
        id: instanceId,
      }).then(() => {
        socket.emit('server-change', elements, instanceId)
      })
    }, 500)()
  }

  return (
    <Box width={'100%'} height={'100%'}>
      <Excalidraw
        ref={(api) => excalidrawRefCallback(api as ExcalidrawImperativeAPI)}
        initialData={{ elements }}
        onChange={(elements) => onChange(elements)}
      />
    </Box>
  )
}

const LoadBoard = () => {
  const instanceId = useParams()?.boardId as TLInstanceId
  const [elements, setElements] = useState<ExcalidrawInitialDataState['elements'] | null>(null)
  const { getSingleCollectionItem } = useFirestore()

  useEffect(() => {
    socket.connect()
    socket.emit('join-room', instanceId)
  }, [])

  useEffect(() => {
    getSingleCollectionItem({ collectionId: 'boardsContent', id: instanceId }).then((data) => {
      setElements(data?.elements)
    })
  }, [])

  return elements ? (
    <Board elements={elements} socket={socket as unknown as Socket} />
  ) : (
    <Stack m={10} spacing={2}>
      <Typography textAlign={'center'}>Loading...</Typography>
      <LinearProgress />
    </Stack>
  )
}

export default LoadBoard
