import { Timestamp } from 'firebase/firestore'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import { BinaryFiles } from '@excalidraw/excalidraw/types/types'
import { matchPath } from 'react-router-dom'
import { SerializedExcalidrawElement } from '../pages/board/components/excalidrawBoard/excalidrawBoard'
import { formatDistance, intervalToDuration } from 'date-fns'
const convertFromDateObject = (date: Date) => Timestamp.fromDate(date)

const convertToObjectDate = (timeObject: { seconds: number; nanoseconds: number }) =>
  new Timestamp(timeObject.seconds, timeObject.nanoseconds).toDate()

export const getRelativeDate = ({
  date,
  upToOneYear = true,
}: {
  date: { seconds: number; nanoseconds: number }
  upToOneYear?: boolean
}) => {
  const convertedDate = convertToObjectDate(date)
  const betweenDate = intervalToDuration({
    end: convertedDate,
    start: new Date(),
  })
  const relativeDate = formatDistance(convertedDate, new Date())
  const yearsBetween = betweenDate.years || 0

  if (upToOneYear) {
    return yearsBetween > 0 ? 'More then 12 months' : relativeDate
  }

  return relativeDate
}

export { convertToObjectDate, convertFromDateObject }

export const serializeExcToFbase = (elements: readonly ExcalidrawElement[]) =>
  [...elements].map(
    (element: Record<string, unknown>) =>
      Object.keys(element).reduce<Record<string, unknown>>((acc, key) => {
        if (element[key] !== undefined) {
          acc[key] = key === 'points' ? JSON.stringify(element[key]) : element[key]
        }
        return acc
      }, {}) as SerializedExcalidrawElement,
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

export const filterFilesToFirestore = (files: BinaryFiles, oldFilesSet: Set<string>) => {
  const filteredFilesIds = Object.keys(files).filter((fileId) => !oldFilesSet.has(fileId))

  return filteredFilesIds.reduce<BinaryFiles>((a, c) => ((a[`files.${c}`] = files[c]), a), {})
}

export const isCurrentPage = (pathname: string, currentPath: string) => {
  return !!matchPath(
    {
      path: pathname,
    },
    currentPath,
  )
}

export const getDiffElements = (
  newElements: readonly ExcalidrawElement[],
  oldElementsMap: Map<string, number>,
) =>
  newElements.filter(
    (element: ExcalidrawElement) => oldElementsMap.get(element.id) !== element.version,
  )
