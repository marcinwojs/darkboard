import { Timestamp } from 'firebase/firestore'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
const convertFromDateObject = (date: Date) => Timestamp.fromDate(date)

const convertToObjectDate = (timeObject: { seconds: number; nanoseconds: number }) =>
  new Timestamp(timeObject.seconds, timeObject.nanoseconds).toDate()

export { convertToObjectDate, convertFromDateObject }

export const serializeExcToFbase = (elements: readonly ExcalidrawElement[]) =>
  [...elements].map((element: Record<string, unknown>) =>
    Object.keys(element).reduce<Record<string, unknown>>((acc, key) => {
      if (element[key] !== undefined) {
        acc[key] = key === 'points' ? JSON.stringify(element[key]) : element[key]
      }
      return acc
    }, {}),
  )
