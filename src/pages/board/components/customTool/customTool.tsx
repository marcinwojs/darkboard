import { LibraryItem } from '@excalidraw/excalidraw/types/types'
import { useEffect, useRef } from 'react'
import { exportToSvg } from '@excalidraw/excalidraw'

type Props = {
  id: LibraryItem['id'] | /** for pending item */ null
  svgStyle?: string
  elements?: LibraryItem['elements']
  onDrag: (id: string, event: React.DragEvent) => void
}

export const CustomTool = ({
  id,
  elements,
  onDrag,
  svgStyle = 'width: 50px; height: 50px',
}: Props) => {
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
        },
        files: null,
      })
      svg.querySelector('.style-fonts')?.remove()
      svg.setAttribute('style', svgStyle)
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

export default CustomTool
