import { useEffect, useRef } from 'react'
import { exportToSvg, MIME_TYPES, serializeLibraryAsJSON } from '@excalidraw/excalidraw'
import { LibraryItem } from '@excalidraw/excalidraw/types/types'
import { rectNotesList } from '../../../../../libraries/stickyNotes/rectNote'
import { Box } from '@mui/material'

const StickyNote = () => {
  const getInsertedElements = () => {
    return [
      {
        ...rectNotesList[0],
        elements: rectNotesList[0].elements,
      },
    ]
  }

  return (
    <Box>
      <LibraryUnit
        elements={rectNotesList[0].elements}
        id={'testtest2'}
        onClick={() => null}
        selected={false}
        onToggle={() => null}
        onDrag={(id, event) => {
          event.dataTransfer.setData(
            MIME_TYPES.excalidrawlib,
            serializeLibraryAsJSON(getInsertedElements()),
          )
        }}
      />
    </Box>
  )
}

export default StickyNote

export const LibraryUnit = ({
  id,
  elements,
  onDrag,
}: {
  id: LibraryItem['id'] | /** for pending item */ null
  elements?: LibraryItem['elements']
  isPending?: boolean
  onClick: () => void
  selected: boolean
  onToggle: (id: string, event: React.MouseEvent) => void
  onDrag: (id: string, event: React.DragEvent) => void
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    ;(async () => {
      if (!elements) {
        return
      }
      const svg = await exportToSvg({
        elements,
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
  }, [elements])

  return (
    <div>
      <div
        ref={ref}
        draggable={!!elements}
        onDragStart={(event) => {
          if (!id) {
            event.preventDefault()
            return
          }
          onDrag(id, event)
        }}
      />
    </div>
  )
}
