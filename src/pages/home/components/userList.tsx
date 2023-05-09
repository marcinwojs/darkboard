import * as React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'

export type UserEntity = {
  firstName: string
  id: string
  email: string
  photo?: string
}

type Props = {
  users: UserEntity[]
}

const UserList = ({ users }: Props) => {
  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      {users.map(({ id, firstName, email }) => {
        return (
          <ListItem key={id}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={firstName} secondary={email} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default UserList
