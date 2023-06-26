import useFirestore from './useFirestore'
import { NotificationData, NotificationEntity } from '../shared/types'
import { v4 as uuidv4 } from 'uuid'
import { arrayUnion } from 'firebase/firestore'

const useNotifications = () => {
  const { updateDocField, getSingleCollectionItem } = useFirestore()

  const getNotificationsList = (userId: string) => {
    return getSingleCollectionItem({ collectionId: 'notifications', id: userId })
  }

  const createNotification = (userId: string, notificationData: NotificationData) => {
    const notification: NotificationEntity = {
      ...notificationData,
      id: uuidv4(),
      date: 'now',
    }

    return updateDocField({
      collectionId: 'notifications',
      id: userId,
      data: { notifications: arrayUnion(notification) },
    })
  }

  return { createNotification, getNotificationsList }
}

export default useNotifications
