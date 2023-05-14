import { TLInstanceId } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import { useEffect, useState, useCallback, useContext } from 'react'
import useFirestore from '../../hooks/useFirestore'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Excalidraw } from '@excalidraw/excalidraw'
import {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { throttle } from 'lodash'
import { Socket } from 'net'
import { WebsocketContext, WebsocketContextType } from '../../providers/websocketProvider'
import UserList from '../board/components/usersList/userList'
import useBoardRoom from '../../hooks/useBoardRoom'
import { FirebaseUserContext, FirebaseUserContextType } from '../../providers/firebaseUserProvider'

export function useCallbackRefState<T>() {
  const [refValue, setRefValue] = useState<T | null>(null)
  const refCallback = useCallback((value: T | null) => setRefValue(value), [])
  return [refValue, refCallback] as const
}

type Props = ExcalidrawInitialDataState & {
  socket: Socket
}

export function Board({ elements, socket }: Props) {
  const instanceId = useParams()?.boardId as TLInstanceId
  const { addToDoc, subToData } = useFirestore()
  const [excalidrawAPI, excalidrawRefCallback] = useCallbackRefState<ExcalidrawImperativeAPI>()
  const [newsestChanges, setNewestChanges] = useState('')

  useEffect(() => {
    if (excalidrawAPI && socket) {
      socket.on('client-change', (freshElements) => {
        excalidrawAPI?.updateScene({ elements: freshElements })
        setNewestChanges(JSON.stringify(freshElements))
      })
    }
  }, [excalidrawAPI])

  const onChange = (elements: readonly ExcalidrawElement[]) => {
    const newNewest = JSON.stringify(elements)
    if (newsestChanges !== newNewest) {
      socket.emit('server-change', elements, instanceId)
      setNewestChanges(newNewest)
      throttle(() => {
        addToDoc({
          collectionId: 'boardsContent',
          data: { elements },
          id: instanceId,
        })
      }, 50)()
    }
  }

  return (
    <Box width={'100%'} height={'100%'}>
      <Excalidraw
        ref={(api) => excalidrawRefCallback(api as ExcalidrawImperativeAPI)}
        initialData={{ elements }}
        onChange={(elements) => onChange(elements)}
      >
        <UserList />
      </Excalidraw>
    </Box>
  )
}

const LoadBoard = () => {
  const { joinRoom } = useBoardRoom()
  const { socket } = useContext(WebsocketContext) as WebsocketContextType
  const instanceId = useParams()?.boardId as TLInstanceId
  const [elements, setElements] = useState<ExcalidrawInitialDataState['elements'] | null>(null)
  const { getSingleCollectionItem } = useFirestore()
  const { user } = useContext(FirebaseUserContext) as FirebaseUserContextType

  useEffect(() => {
    if (user) {
      joinRoom(instanceId, user?.id).then(() => {
        socket.connect()
        socket.emit('join-room', instanceId)
      })
    }
  }, [])

  useEffect(() => {
    getSingleCollectionItem({ collectionId: 'boardsContent', id: instanceId }).then((data) => {
      setElements(data?.elements)
    })
  }, [])

  return elements && socket ? (
    <Board elements={elements} socket={socket as unknown as Socket} />
  ) : (
    <Stack m={10} spacing={2}>
      <Typography textAlign={'center'}>Loading...</Typography>
      <LinearProgress />
    </Stack>
  )
}

export default LoadBoard
