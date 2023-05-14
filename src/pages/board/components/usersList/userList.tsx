import { useContext, useEffect, useState } from 'react'
import { WebsocketContext, WebsocketContextType } from '../../../../providers/websocketProvider'
import { Typography } from '@mui/material'

const UserList = () => {
  const { socket } = useContext(WebsocketContext) as WebsocketContextType
  const [numberOfUsers, setNumberOfUsers] = useState(0)

  useEffect(() => {
    socket.on('updateUserNumber', (usersNumber: number) => {
      console.log('lol')
      setNumberOfUsers(usersNumber)
    })
  })

  return <Typography>{numberOfUsers}</Typography>
}

export default UserList
