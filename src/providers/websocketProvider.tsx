import { createContext, FC, ReactNode } from 'react'
import { io } from 'socket.io-client'
import { Socket } from 'net'
import { DefaultEventsMap } from '@socket.io/component-emitter'

export type WebsocketContextType = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
}

export const WebsocketContext = createContext<WebsocketContextType | null>(null)

const socket = io('http://localhost:3002/', {
  autoConnect: false,
})

const WebsocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <WebsocketContext.Provider value={{ socket }}>{children}</WebsocketContext.Provider>
}

export default WebsocketProvider
