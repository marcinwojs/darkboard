import { useEffect, useState, useCallback } from 'react'
import { Box, useTheme } from '@mui/material'
import { Excalidraw, WelcomeScreen } from '@excalidraw/excalidraw'
import {
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types/types'
import {
  ExcalidrawElement,
  ExcalidrawImageElement,
} from '@excalidraw/excalidraw/types/element/types'
import {
  filterFilesToFirestore,
  getDiffElements,
  serializeExcToFbase,
} from '../../../../shared/utils'
import { UserEntity } from '../../../../hooks/useFirestoreUser'
import useBoardUpdates from '../../../../hooks/useBoardUpdates'
import { BoardEntity } from '../../../boards/components/boardTable/boardTable'
import CustomMainMenu from './customMainMenu'
import Logo from '../../../../layout/logo'
import AdditionalButtons from './additionalButtons'
import useBoardRoom from '../../../../hooks/useBoardRoom'

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
  const { getBoardFiles } = useBoardRoom()
  const [excalidrawAPI, excalidrawRefCallback] = useCallbackRefState<ExcalidrawImperativeAPI>()
  const [oldElementsMap, setOldElementsMap] = useState(
    new Map(elements?.map((e) => [e.id, e.version])),
  )
  const [oldFilesSet, setOldFilesSet] = useState(new Set(Object.keys(files || {})))

  useEffect(() => {
    if (excalidrawAPI) {
      if (files) excalidrawAPI?.addFiles(Object.values(files))

      handleUpdatePointerPosition(user.id, (data) => {
        const map = excalidrawAPI.getAppState().collaborators
        Object.values(data).map((us) => {
          if (us.id) map.set(us.id, us)
        })
        excalidrawAPI?.updateScene({
          collaborators: map,
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
              newSet.add(imageElement.fileId)
              return true
            }
          })

          if (newFilesElements.length) {
            setOldFilesSet(newSet)
            getBoardFiles(boardData.boardId).then((files) =>
              excalidrawAPI?.addFiles(Object.values(files)),
            )
          }
          updateOldElementsMap(diffs)
          excalidrawAPI?.updateScene({ elements: [...newMap.values()] })
        }
      })
    }
  }, [excalidrawAPI])

  const updateOldElementsMap = (diffElements: ExcalidrawElement[]) => {
    setOldElementsMap((prevState) => {
      const newState = prevState
      diffElements.forEach((element: ExcalidrawElement) =>
        newState.set(element.id, element.version),
      )
      return newState
    })
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
    <Box width={'100%'} height={'inherit'}>
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
        onChange={(elements, appState, files) => {
          onChange(elements, files)
        }}
        onPointerUpdate={(payload) => updatePointerPosition(user, payload)}
        renderTopRightUI={() => (
          <AdditionalButtons board={boardData} isAdmin={user.id === boardData.creatorId} />
        )}
      >
        <CustomMainMenu boardName={boardData.boardName} />
        <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint>Menu hint</WelcomeScreen.Hints.MenuHint>
          <WelcomeScreen.Hints.HelpHint>Help hint</WelcomeScreen.Hints.HelpHint>
          <WelcomeScreen.Hints.ToolbarHint>Toolbar hint</WelcomeScreen.Hints.ToolbarHint>
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.Logo>
              <Logo sx={{}} />
            </WelcomeScreen.Center.Logo>
            <WelcomeScreen.Center.Heading>Welcome Screen Heading!</WelcomeScreen.Center.Heading>
            <WelcomeScreen.Center.Menu>
              <WelcomeScreen.Center.MenuItemLink href={'/'}>Home</WelcomeScreen.Center.MenuItemLink>
              <WelcomeScreen.Center.MenuItemLink href={'/boards'}>
                Boards
              </WelcomeScreen.Center.MenuItemLink>
            </WelcomeScreen.Center.Menu>
          </WelcomeScreen.Center>
        </WelcomeScreen>
      </Excalidraw>
    </Box>
  )
}

export default ExcalidrawBoard
