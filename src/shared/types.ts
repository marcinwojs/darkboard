export enum RequestTypes {
  access = 'access',
}

export type AccessRequestData = {
  type: RequestTypes.access
  metaData: {
    userId: string
  }
}

export type RequestData = AccessRequestData

export type RequestEntity = RequestData & {
  id: string
  date: string
}

export enum NotificationTypes {
  request = 'request',
}

export type NotificationData = {
  type: NotificationTypes
  message: string
}

export type NotificationEntity = NotificationData & {
  id: string
  requestId?: RequestEntity['id']
  date: string
}
