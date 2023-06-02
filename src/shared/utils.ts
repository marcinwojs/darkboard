import { Timestamp } from 'firebase/firestore'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { matchPath } from 'react-router-dom'
import { SerializedExcalidrawElement } from '../pages/board/components/excalidrawBoard/excalidrawBoard'
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

export const deserializeFbaseToExc = (elements: SerializedExcalidrawElement[]) =>
  elements.map((element) => {
    const points = element?.points
    if (points) {
      return {
        ...element,
        points: JSON.parse(points),
      }
    } else return element
  })

export const filterFiles = (files: BinaryFiles, oldFilesSet: Set<string>) => {
  const filteredFiles = files

  Object.keys(files).forEach((fileId) => {
    if (oldFilesSet.has(fileId)) {
      delete filteredFiles[fileId]
    }
  })

  return Object.keys(filteredFiles).reduce<Record<string, unknown>>(
    (a, c) => ((a[`files.${c}`] = filteredFiles[c]), a),
    {},
  )
}

export const isCurrentPage = (pathname: string, currentPath: string) => {
  return !!matchPath(
    {
      path: pathname,
    },
    currentPath,
  )
}
