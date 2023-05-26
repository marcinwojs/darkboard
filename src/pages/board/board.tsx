import { TLInstanceId } from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import { useEffect, useState, useCallback, useContext } from 'react'
import useFirestore from '../../hooks/useFirestore'
import { Box, LinearProgress, Stack, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Excalidraw, MainMenu } from '@excalidraw/excalidraw'
import { ref, onValue, update, onDisconnect } from 'firebase/database'
import {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types/types'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { Socket } from 'net'
import { WebsocketContext, WebsocketContextType } from '../../providers/websocketProvider'
import useBoardRoom from '../../hooks/useBoardRoom'
import { UserEntity, useUserContext } from '../../providers/firebaseUserProvider'
import { rdb } from '../../config/firebase'
import ShareButton from './components/shareButton/shareButton'
import { serializeExcToFbase } from '../../shared/utils'

export function useCallbackRefState<T>() {
  const [refValue, setRefValue] = useState<T | null>(null)
  const refCallback = useCallback((value: T | null) => setRefValue(value), [])
  return [refValue, refCallback] as const
}

const baseExcalidrawElement = {
  groupIds: [],
}

type Props = ExcalidrawInitialDataState & {
  socket: Socket
  user: UserEntity
  instanceId: string
}

export function Board({ elements, appState, user, socket, instanceId }: Props) {
  const theme = useTheme()
  const { updateDocField } = useFirestore()
  const [excalidrawAPI, excalidrawRefCallback] = useCallbackRefState<ExcalidrawImperativeAPI>()
  const oldElementsMap = new Map(elements?.map((e) => [e.id, e.version]))

  useEffect(() => {
    if (excalidrawAPI && socket) {
      onValue(ref(rdb, `pointer-update/${instanceId}`), (snapshot) => {
        const data = snapshot.val() || {}
        delete data[user?.id]

        excalidrawAPI?.updateScene({
          collaborators: new Map(Object.entries(data)),
        })
        onDisconnect(ref(rdb, `pointer-update/${instanceId}/${user.id}`)).remove()
      })

      onValue(ref(rdb, `board-update/${instanceId}`), (snapshot) => {
        const { elements: newElements } = snapshot.val() || {}
        if (newElements) {
          const newMap = new Map(
            excalidrawAPI.getSceneElementsIncludingDeleted()?.map((e) => [e.id, e]),
          )
          const diffs: ExcalidrawElement[] = []

          newElements.forEach((element: ExcalidrawElement) => {
            if (oldElementsMap.get(element.id) !== element.version) {
              diffs.push(element)
              newMap.set(element.id, { ...baseExcalidrawElement, ...element })
              oldElementsMap.set(element.id, element.version)
            }
          })

          if (diffs.length) excalidrawAPI?.updateScene({ elements: Array.from(newMap.values()) })
        }
        onDisconnect(ref(rdb, `board-update/${instanceId}`)).remove()
      })
    }
  }, [excalidrawAPI])

  const onChange = (elements: readonly ExcalidrawElement[]) => {
    const diffs: ExcalidrawElement[] = []

    elements.forEach((element: ExcalidrawElement) => {
      if (oldElementsMap.get(element.id) !== element.version) {
        diffs.push(element)
        oldElementsMap.set(element.id, element.version)
      }
    })

    if (diffs.length > 0) {
      const serializedElements = serializeExcToFbase(elements)

      updateDocField({
        collectionId: 'boardsContent',
        data: { elements: serializedElements },
        id: instanceId,
      })
      update(ref(rdb, `board-update/${instanceId}`), { elements: diffs })
    }
  }

  const onPointerChange = ({
    pointer,
    button,
  }: {
    pointer: { x: number; y: number }
    pointersMap: Map<number, Readonly<{ x: number; y: number }>>
    button: 'down' | 'up'
  }) => {
    update(ref(rdb, `pointer-update/${instanceId}`), {
      [`${user?.id}`]: {
        pointer,
        button,
        username: user?.firstName || '',
        id: user?.id,
      },
    })
  }

  return (
    <Box width={'100%'} height={'100vh'}>
      <Excalidraw
        theme={theme.palette.mode}
        autoFocus
        ref={(api) => excalidrawRefCallback(api as ExcalidrawImperativeAPI)}
        initialData={{ elements, appState }}
        onChange={(elements) => onChange(elements)}
        onPointerUpdate={onPointerChange}
        renderTopRightUI={() => <ShareButton id={instanceId} />}
      >
        <MainMenu>
          <MainMenu.DefaultItems.SaveToActiveFile />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Help />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.Separator />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
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
  const { user } = useUserContext()

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

  return elements && socket && user ? (
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
