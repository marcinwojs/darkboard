import { useEffect, useState, useCallback } from 'react'
import { Box, useTheme } from '@mui/material'
import { Excalidraw } from '@excalidraw/excalidraw'
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
import {
  filterFilesToFirestore,
  getDiffElements,
  serializeExcToFbase,
} from '../../../../shared/utils'
import ShareButton from '../shareButton/shareButton'
import { UserEntity } from '../../../../hooks/useFirestoreUser'
import useBoardUpdates from '../../../../hooks/useBoardUpdates'
import { BoardEntity } from '../../../boards/components/boardTable/boardTable'
import CustomMainMenu from './customMainMenu'

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
  boardData: BoardEntity
}

const ExcalidrawBoard = ({
  elements,
  appState,
  files,
  user,
  instanceId,
  boardData,
  libraryItems,
}: Props) => {
  const theme = useTheme()
  const {
    updatePointerPosition,
    handleUpdatePointerPosition,
    updateBoardElements,
    handleUpdateBoardElements,
  } = useBoardUpdates({ instanceId })
  const { getSingleCollectionItem } = useFirestore()
  const [excalidrawAPI, excalidrawRefCallback] = useCallbackRefState<ExcalidrawImperativeAPI>()
  const oldElementsMap = new Map(elements?.map((e) => [e.id, e.version]))
  const oldFilesSet = new Set(Object.keys(files || {}))

  useEffect(() => {
    if (excalidrawAPI) {
      handleUpdatePointerPosition(user.id, (data) => {
        excalidrawAPI?.updateScene({
          collaborators: new Map(Object.entries(data)),
        })
      })

      handleUpdateBoardElements((newElements) => {
        const newMap = new Map(
          excalidrawAPI.getSceneElementsIncludingDeleted()?.map((e) => [e.id, e]),
        )
        const diffs: ExcalidrawElement[] = getDiffElements(newElements, oldElementsMap)

        if (diffs.length) {
          const newSet = new Set(Object.keys(excalidrawAPI.getFiles() || {}))

          const newFilesElements = diffs.filter((element) => {
            const imageElement = element as ExcalidrawImageElement
            newMap.set(element.id, { ...baseExcalidrawElement, ...element })

            if (imageElement.fileId && !newSet.has(imageElement.fileId)) {
              oldFilesSet.add(imageElement.fileId)
              return true
            }
          })

          if (newFilesElements.length) {
            getSingleCollectionItem({
              collectionId: 'boardsContent',
              id: `${instanceId}`,
            }).then((data) => excalidrawAPI?.addFiles(Object.values(data.files)))
          }

          updateOldElementsMap(diffs)
          excalidrawAPI?.updateScene({ elements: Array.from(newMap.values()) })
        }
      })
    }
  }, [excalidrawAPI])

  const updateOldElementsMap = (diffElements: ExcalidrawElement[]) => {
    diffElements.forEach((element: ExcalidrawElement) =>
      oldElementsMap.set(element.id, element.version),
    )
  }

  const onChange = (elements: readonly ExcalidrawElement[], files: BinaryFiles) => {
    const diffs = getDiffElements(elements, oldElementsMap)

    if (diffs.length > 0) {
      const serializedElements = serializeExcToFbase(elements)
      const filteredFiles = filterFilesToFirestore(files, oldFilesSet)

      updateOldElementsMap(diffs)
      updateBoardElements(diffs, serializedElements, filteredFiles)
    }
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
          libraryItems,
        }}
        onChange={(elements, appState, files) => onChange(elements, files)}
        onPointerUpdate={(payload) => updatePointerPosition(user, payload)}
        renderTopRightUI={() => <ShareButton id={instanceId} />}
      >
        <CustomMainMenu boardName={boardData.boardName} />
      </Excalidraw>
    </Box>
  )
}

export default ExcalidrawBoard
