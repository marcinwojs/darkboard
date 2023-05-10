import {
  App,
  Canvas,
  ContextMenu,
  getUserData,
  TldrawEditor,
  TldrawUi,
  TldrawUiContextProvider,
  TLInstanceId,
  useApp,
} from '@tldraw/tldraw'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import { useCallback, useEffect } from 'react'
import useFirestore from '../../hooks/useFirestore'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function Board() {
  const instanceId = useParams()?.boardId as TLInstanceId
  const userData = getUserData()
  const { getSingleCollectionItem } = useFirestore()

  const onMount = useCallback((app: App) => {
    getSingleCollectionItem({ collectionId: 'boardsContent', id: instanceId }).then((data) => {
      app.store.mergeRemoteChanges(() => {
        app.store.put(data?.records || [])
      })
    })
  }, [])

  return (
    <Box width={'100%'} height={'100%'}>
      <TldrawEditor instanceId={instanceId} onMount={onMount} userId={userData.id}>
        <TldrawUiContextProvider>
          <ContextMenu>
            <Canvas />
            <InsideOfAppContext />
          </ContextMenu>
          <TldrawUi />
        </TldrawUiContextProvider>
      </TldrawEditor>
    </Box>
  )
}

const InsideOfAppContext = () => {
  const app = useApp()
  const { addToDoc } = useFirestore()

  let timerId: string | number | NodeJS.Timeout | undefined
  function debounce(callback: () => void, delay: number | undefined) {
    clearTimeout(timerId)
    timerId = setTimeout(callback, delay)
  }

  useEffect(() => {
    app.store.listen(() => {
      debounce(() => {
        addToDoc({
          collectionId: 'boardsContent',
          data: { records: app.store.allRecords() },
          id: app.instanceId,
        })
      }, 100)
    })
  })

  return null
}
