import Avatar from '@mui/material/Avatar'
import { AvatarGroup as Group, useTheme } from '@mui/material'

type Props = {
  users: { id: string; name: string; photo?: string }[]
  creatorId?: string
}
const AvatarGroup = ({ users, creatorId }: Props) => {
  const theme = useTheme()

  return (
    <Group
      max={3}
      total={users.length}
      sx={{ justifyContent: 'center' }}
      slotProps={{ additionalAvatar: { sx: { width: 26, height: 26, fontSize: 'medium' } } }}
    >
      {users.map(({ id, name, photo }) => {
        return (
          <Avatar
            key={id}
            alt={name}
            src={photo}
            sx={{
              width: 26,
              height: 26,
              ...(creatorId === id && { color: theme.palette.primary.main }),
            }}
          >
            {name[0]}
          </Avatar>
        )
      })}
    </Group>
  )
}

export default AvatarGroup
