import kanban from './KANBAN.json'
import kanban2 from './KANBAN2.json'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'

export enum BoardsTemplatesKeys {
  blank = 'blank',
  kanban = 'kanban',
  kanban2 = 'kanban2',
}

export const boardTemplates: Record<
  BoardsTemplatesKeys,
  { name: string; initialElements: ExcalidrawElement[] }
> = {
  blank: {
    name: 'Blank',
    initialElements: [],
  },
  kanban: {
    name: 'Kanban',
    initialElements: kanban.elements as ExcalidrawElement[],
  },
  kanban2: {
    name: 'Kanban 2',
    initialElements: kanban2.elements as ExcalidrawElement[],
  },
}
