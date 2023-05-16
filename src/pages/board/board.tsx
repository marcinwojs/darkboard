import { TLInstanceId } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import { useEffect, useState, useCallback, useContext } from 'react'
import useFirestore from '../../hooks/useFirestore'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Excalidraw } from '@excalidraw/excalidraw'
import { ref, onValue, update, onDisconnect } from 'firebase/database'
import {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { debounce } from 'lodash'
import { Socket } from 'net'
import { WebsocketContext, WebsocketContextType } from '../../providers/websocketProvider'
import useBoardRoom from '../../hooks/useBoardRoom'
import { FirebaseUserContext, FirebaseUserContextType } from '../../providers/firebaseUserProvider'
import { rdb } from '../../config/firebase'
import ShareButton from './components/shareDialog/shareButton'

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
  const oldElementsMap = new Map(elements?.map((e) => [e.id, e]))

  useEffect(() => {
    if (excalidrawAPI && socket) {
      socket.on('client-change', (elements) => {
        elements.forEach((e: ExcalidrawElement) => oldElementsMap.set(e.id, e))
        excalidrawAPI?.updateScene({ elements: Array.from(oldElementsMap.values()) })
      })

      onValue(ref(rdb, `pointer-update/${instanceId}`), (snapshot) => {
        if (user) {
          const data = snapshot.val() || {}
          delete data[user?.id]

          excalidrawAPI?.updateScene({ collaborators: new Map(Object.entries(data)) })
          const myConnectionsRef = ref(rdb, `pointer-update/${instanceId}/${user.id}`)
          onDisconnect(myConnectionsRef).remove()
        }
      })
    }
  }, [excalidrawAPI])

  const onChange = (elements: readonly ExcalidrawElement[]) => {
    const diffs: ExcalidrawElement[] = []

    elements.forEach((element) => {
      if (oldElementsMap.get(element.id)?.version !== element.version) {
        diffs.push(element)
        oldElementsMap.set(element.id, { ...element })
      }
    })

    if (diffs.length > 0) {
      const serializedElements = [...elements].map((element) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const points = element?.points

        if (points) {
          return {
            ...element,
            points: JSON.stringify(points),
          }
        } else return element
      })

      updateDocField({
        collectionId: 'boardsContent',
        data: { elements: serializedElements },
        id: instanceId,
      })
      socket.emit('server-change', diffs, instanceId)
    }
  }

  const onPointerChange = ({
    pointer,
    button,
  }: {
    pointer: { x: number; y: number }
    button: 'down' | 'up'
  }) => {
    if (user) {
      update(ref(rdb, `pointer-update/${instanceId}`), {
        [`${user?.id}`]: { pointer, button, username: user?.firstName || '', id: user?.id },
      })
    }
  }

  return (
    <Box width={'100%'} height={'100%'}>
      <Excalidraw
        autoFocus
        ref={(api) => excalidrawRefCallback(api as ExcalidrawImperativeAPI)}
        initialData={{ elements, appState }}
        onChange={(elements) => {
          debounce(() => {
            onChange(elements)
          }, 100)()
        }}
        onPointerUpdate={(payload) => onPointerChange(payload)}
        renderTopRightUI={() => <ShareButton id={instanceId} />}
      />
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
  }, [user])

  useEffect(() => {
    getSingleCollectionItem({ collectionId: 'boardsContent', id: instanceId }).then((data) => {
      const deserializedElements = [...data.elements].map((element) => {
        const points = element?.points
        if (points) {
          return {
            ...element,
            points: JSON.parse(points),
          }
        } else return element
      })

      setElements(deserializedElements)
    })
  }, [])

  return elements && socket ? (
    <Board
      instanceId={instanceId}
      elements={elements}
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
