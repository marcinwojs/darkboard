import { TLInstanceId } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import { useEffect, useState, useCallback, useContext } from 'react'
import useFirestore from '../../hooks/useFirestore'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Excalidraw } from '@excalidraw/excalidraw'
import {
  Collaborator,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { throttle } from 'lodash'
import { Socket } from 'net'
import { WebsocketContext, WebsocketContextType } from '../../providers/websocketProvider'
import useBoardRoom from '../../hooks/useBoardRoom'
import { FirebaseUserContext, FirebaseUserContextType } from '../../providers/firebaseUserProvider'

export function useCallbackRefState<T>() {
  const [refValue, setRefValue] = useState<T | null>(null)
  const refCallback = useCallback((value: T | null) => setRefValue(value), [])
  return [refValue, refCallback] as const
}

type Props = ExcalidrawInitialDataState & {
  socket: Socket
  user: FirebaseUserContextType['user']
  instanceId: string
}

export function Board({ elements, appState, user, socket, instanceId }: Props) {
  const { updateDocField } = useFirestore()
  const [excalidrawAPI, excalidrawRefCallback] = useCallbackRefState<ExcalidrawImperativeAPI>()
  const [newsestChanges, setNewestChanges] = useState('')
  const collaboratorsMap = appState?.collaborators

  useEffect(() => {
    if (excalidrawAPI && socket) {
      socket.on('client-change', (freshElements) => {
        excalidrawAPI?.updateScene({ elements: freshElements })
        setNewestChanges(JSON.stringify(freshElements))
      })

      socket.on('client-change-collaborators', (collaborator) => {
        collaboratorsMap?.set(collaborator.id, collaborator)
        excalidrawAPI?.updateScene({ collaborators: collaboratorsMap })
      })
    }
  }, [excalidrawAPI])

  const onChange = (elements: readonly ExcalidrawElement[]) => {
    const newNewest = JSON.stringify(elements)
    if (newsestChanges !== newNewest) {
      throttle(() => {
        updateDocField({
          collectionId: 'boardsContent',
          data: { elements },
          id: instanceId,
        })
      }, 50)()
      socket.emit('server-change', elements, instanceId)
      setNewestChanges(newNewest)
    }
  }

  const onPointerChange = ({
    pointer,
    button,
  }: {
    pointer: { x: number; y: number }
    button: 'down' | 'up'
  }) => {
    throttle(() => {
      const collaborator = { pointer, button, username: user?.firstName || '', id: user?.id }

      updateDocField({
        collectionId: 'boardsContent',
        data: {
          [`collaborators.${collaborator.id}`]: collaborator,
        },
        id: instanceId,
      })

      socket.emit('server-change-collaborators', collaborator, instanceId)
    }, 100)()
  }

  return (
    <Box width={'100%'} height={'100%'}>
      <Excalidraw
        autoFocus
        ref={(api) => excalidrawRefCallback(api as ExcalidrawImperativeAPI)}
        initialData={{ elements, appState }}
        onChange={(elements) => onChange(elements)}
        onPointerUpdate={onPointerChange}
      >
      </Excalidraw>
    </Box>
  )
}

const LoadBoard = () => {
  const { joinRoom } = useBoardRoom()
  const { socket } = useContext(WebsocketContext) as WebsocketContextType
  const instanceId = useParams()?.boardId as TLInstanceId
  const [elements, setElements] = useState<ExcalidrawInitialDataState['elements'] | null>(null)
  const [collaborators, setCollaborators] = useState<Map<string, Collaborator>>(new Map())
  const { getSingleCollectionItem } = useFirestore()
  const { user } = useContext(FirebaseUserContext) as FirebaseUserContextType

  useEffect(() => {
    if (user) {
      joinRoom(instanceId, user?.id).then(() => {
        socket.connect()
        socket.emit('join-room', instanceId)
      })
    }
  }, [user])

  useEffect(() => {
    getSingleCollectionItem({ collectionId: 'boardsContent', id: instanceId }).then((data) => {
      const { collaborators, elements } = data
      if (collaborators && user) {
        delete collaborators[user?.id]
        setCollaborators(new Map(Object.entries(collaborators)))
      }
      if (elements) {
        setElements(elements)
      }
    })
  }, [])

  return elements && socket ? (
    <Board
      instanceId={instanceId}
      elements={elements}
      appState={{ collaborators: collaborators }}
      socket={socket as unknown as Socket}
      user={user}
    />
  ) : (
    <Stack m={10} spacing={2}>
      <Typography textAlign={'center'}>Loading...</Typography>
      <LinearProgress />
    </Stack>
  )
}

export default LoadBoard
