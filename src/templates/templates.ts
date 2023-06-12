import kanban from './KANBAN.json'
import kanban2 from './KANBAN2.json'

export const boardTemplates = {
  kanban: {
    name: 'Kanban',
    initialElements: kanban.elements,
  },
  kanban2: {
    name: 'Kanban 2',
    initialElements: kanban2.elements,
  },
}

export type BoardsTemplatesKeys = keyof typeof boardTemplates
