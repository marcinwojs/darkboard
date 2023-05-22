import Avatar from '@mui/material/Avatar'
import { AvatarGroup as Group, useTheme } from '@mui/material'

type Props = {
  users: { id: string; name: string; photo?: string }[]
}
const AvatarGroup = ({ users }: Props) => {
  const theme = useTheme()

  return (
    <Group max={4} total={users.length} sx={{ justifyContent: 'center' }}>
      {users.map(({ id, name, photo }) => {
        return (
          <Avatar sx={{ bgcolor: theme.palette.primary.main }} key={id} alt={name} src={photo}>
            {name[0]}
          </Avatar>
        )
      })}
    </Group>
  )
}

export default AvatarGroup
