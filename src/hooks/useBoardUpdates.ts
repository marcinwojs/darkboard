import { onDisconnect, onValue, ref, update } from 'firebase/database'
import { rdb } from '../config/firebase'
import { UserEntity } from '../providers/firebaseUserProvider'
import { BinaryFiles, Gesture } from '@excalidraw/excalidraw/types/types'
import useFirestore from './useFirestore'
import { SerializedExcalidrawElement } from '../pages/board/components/excalidrawBoard/excalidrawBoard'
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'

type UpdatePointerPositionPayload = {
  pointer: {
    x: number
    y: number
  }
  button: 'down' | 'up'
  pointersMap: Gesture['pointers']
}

type UserPointerEntity = UpdatePointerPositionPayload & {
  username: string
}

type Props = {
  instanceId: string
}

const useBoardUpdates = ({ instanceId }: Props) => {
  const { updateDocField } = useFirestore()

  const updatePointerPosition = (user: UserEntity, payload: UpdatePointerPositionPayload) => {
    update(ref(rdb, `pointer-update/${instanceId}`), {
      [`${user?.id}`]: {
        ...payload,
        username: user?.firstName || '',
        id: user?.id,
      },
    })
  }

  const handleUpdatePointerPosition = (
    userId: string,
    callback: (data: Record<string, UserPointerEntity>) => void,
  ) =>
    onValue(ref(rdb, `pointer-update/${instanceId}`), (snapshot) => {
      const data = snapshot.val() || {}
      delete data[userId]

      callback(data)
      onDisconnect(ref(rdb, `pointer-update/${instanceId}/${userId}`)).remove()
    })

  const updateBoardElements = (
    diffElements: ExcalidrawElement[],
    serializedElements: SerializedExcalidrawElement[],
    files: BinaryFiles,
  ) => {
    updateDocField({
      collectionId: 'boardsContent',
      data: { elements: serializedElements, ...files },
      id: instanceId,
    })
    update(ref(rdb, `board-update/${instanceId}`), { elements: diffElements })
  }

  const handleUpdateBoardElements = (callback: (newElements: ExcalidrawElement[]) => void) => {
    onValue(ref(rdb, `board-update/${instanceId}`), (snapshot) => {
      const { elements: newElements } = snapshot.val() || {}

      if (newElements) {
        callback(newElements)
      }

      onDisconnect(ref(rdb, `board-update/${instanceId}`)).remove()
    })
  }

  return {
    updatePointerPosition,
    handleUpdatePointerPosition,
    updateBoardElements,
    handleUpdateBoardElements,
  }
}

export default useBoardUpdates
