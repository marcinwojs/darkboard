import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import { useEffect, useState, useCallback } from 'react'
import { Box, useTheme } from '@mui/material'
import { Excalidraw, MainMenu } from '@excalidraw/excalidraw'
import { ref, onValue, update, onDisconnect } from 'firebase/database'
import {
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types/types'
import {
  ExcalidrawElement,
  ExcalidrawImageElement,
} from '@excalidraw/excalidraw/types/element/types'
import useFirestore from '../../../../hooks/useFirestore'
import { filterFiles, serializeExcToFbase } from '../../../../shared/utils'
import { rdb } from '../../../../config/firebase'
import ShareButton from '../shareButton/shareButton'
import { UserEntity } from '../../../../hooks/useFirestoreUser'

export function useCallbackRefState<T>() {
  const [refValue, setRefValue] = useState<T | null>(null)
  const refCallback = useCallback((value: T | null) => setRefValue(value), [])
  return [refValue, refCallback] as const
}

const baseExcalidrawElement = {
  groupIds: [],
}

export type SerializedExcalidrawElement = ExcalidrawElement & {
  points: string
}

type Props = ExcalidrawInitialDataState & {
  user: UserEntity
  instanceId: string
}

const ExcalidrawBoard = ({ elements, appState, files, user, instanceId }: Props) => {
  const theme = useTheme()
  const { updateDocField, getSingleCollectionItem } = useFirestore()
  const [excalidrawAPI, excalidrawRefCallback] = useCallbackRefState<ExcalidrawImperativeAPI>()
  const oldElementsMap = new Map(elements?.map((e) => [e.id, e.version]))
  const oldFilesSet = new Set(Object.keys(files || {}))

  useEffect(() => {
    if (excalidrawAPI) {
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

          if (diffs.length) {
            const newFiles: string[] = []
            const newSet = new Set(Object.keys(excalidrawAPI.getFiles() || {}))

            diffs.forEach((element) => {
              const imageElement = element as ExcalidrawImageElement
              if (imageElement.fileId && !newSet.has(imageElement.fileId)) {
                newFiles.push(imageElement.fileId)
                oldFilesSet.add(imageElement.fileId)
              }
            })

            if (newFiles.length) {
              getSingleCollectionItem({
                collectionId: 'boardsContent',
                id: `${instanceId}`,
              }).then((data) => excalidrawAPI?.addFiles(Object.values(data.files)))
            }
            excalidrawAPI?.updateScene({ elements: Array.from(newMap.values()) })
          }
        }
        onDisconnect(ref(rdb, `board-update/${instanceId}`)).remove()
      })
    }
  }, [excalidrawAPI])

  const onChange = (elements: readonly ExcalidrawElement[], files: BinaryFiles) => {
    const diffs: ExcalidrawElement[] = []

    elements.forEach((element: ExcalidrawElement) => {
      if (oldElementsMap.get(element.id) !== element.version) {
        diffs.push(element)
        oldElementsMap.set(element.id, element.version)
      }
    })

    if (diffs.length > 0) {
      const serializedElements = serializeExcToFbase(elements)
      const filteredFiles = filterFiles(files, oldFilesSet)

      updateDocField({
        collectionId: 'boardsContent',
        data: { elements: serializedElements, ...filteredFiles },
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
        initialData={{
          elements,
          appState,
          files,
        }}
        onChange={(elements, appState, files) => onChange(elements, files)}
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

export default ExcalidrawBoard
