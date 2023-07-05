import useFirestore from './useFirestore'
import { v4 as uuidv4 } from 'uuid'
import { arrayUnion } from 'firebase/firestore'
import { convertFromDateObject } from '../shared/utils'

export enum NotificationTypes {
  request = 'request',
}

export type NotificationData = {
  type: NotificationTypes
  message: string
}

export type NotificationEntity = NotificationData & {
  id: string
  requestId?: string
  date: { seconds: number; nanoseconds: number }
  isRead: boolean
}

const useNotifications = () => {
  const { updateDocField, getSingleCollectionItem } = useFirestore()

  const getNotificationsList = (userId: string) => {
    return getSingleCollectionItem<NotificationEntity[]>({
      collectionId: 'notifications',
      id: userId,
    })
  }

  const createNotification = (userId: string, notificationData: NotificationData) => {
    const notification: NotificationEntity = {
      ...notificationData,
      id: uuidv4(),
      date: convertFromDateObject(new Date()),
      isRead: false,
    }

    return updateDocField({
      collectionId: 'notifications',
      id: userId,
      data: { notifications: arrayUnion(notification) },
    })
  }

  const markAllAsRead = async (userId: string, notifications: NotificationEntity[]) => {
    const readNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }))

    return updateDocField({
      collectionId: 'notifications',
      id: userId,
      data: { notifications: readNotifications },
    })
  }

  return { createNotification, getNotificationsList, markAllAsRead }
}

export default useNotifications
