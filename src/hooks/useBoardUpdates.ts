import { onDisconnect, onValue, ref, update } from 'firebase/database'
import { rdb } from '../config/firebase'
import { UserEntity } from '../providers/firebaseUserProvider'
import { Gesture } from '@excalidraw/excalidraw/types/types'

type Props = {
  instanceId: string
}

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

const useBoardUpdates = ({ instanceId }: Props) => {
  const updatePointerPosition = (user: UserEntity, payload: UpdatePointerPositionPayload) => {
    update(ref(rdb, `pointer-update/${instanceId}`), {
      [`${user?.id}`]: {
        ...payload,
        username: user?.firstName || '',
        id: user?.id,
      },
    })
  }

  const handlePointerUpdatePosition = (
    userId: string,
    callback: (data: Record<string, UserPointerEntity>) => void,
  ) =>
    onValue(ref(rdb, `pointer-update/${instanceId}`), (snapshot) => {
      const data = snapshot.val() || {}
      delete data[userId]

      callback(data)
      onDisconnect(ref(rdb, `pointer-update/${instanceId}/${userId}`)).remove()
    })

  return { updatePointerPosition, handlePointerUpdatePosition }
}

export default useBoardUpdates
