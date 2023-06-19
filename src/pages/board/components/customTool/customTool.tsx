import { useEffect, useRef } from 'react'
import { exportToSvg, MIME_TYPES, serializeLibraryAsJSON } from '@excalidraw/excalidraw'
import { LibraryItem } from '@excalidraw/excalidraw/types/types'
import { Box } from '@mui/material'

const CustomTool = (libraryItem: LibraryItem) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    (async () => {
      if (!libraryItem.elements) {
        return
      }
      const svg = await exportToSvg({
        elements: libraryItem.elements,
        appState: {
          exportBackground: false,
          viewBackgroundColor: '#fff',
        },
        files: null,
      })
      svg.querySelector('.style-fonts')?.remove()
      svg.setAttribute('style', 'width: 50px; height: 50px')
      node.innerHTML = svg.outerHTML
    })()

    return () => {
      node.innerHTML = ''
    }
  }, [libraryItem.elements])

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (!libraryItem.id) {
      event.preventDefault()
      return
    }
    event.dataTransfer.setData(MIME_TYPES.excalidrawlib, serializeLibraryAsJSON([libraryItem]))
  }

  return (
    <Box>
      <Box
        sx={{ cursor: 'grab' }}
        ref={ref}
        draggable={!!libraryItem.elements}
        onDragStart={onDragStart}
      />
    </Box>
  )
}

export default CustomTool
