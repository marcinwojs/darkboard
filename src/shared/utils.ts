import { Timestamp } from 'firebase/firestore'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { matchPath, useLocation } from 'react-router-dom'
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
