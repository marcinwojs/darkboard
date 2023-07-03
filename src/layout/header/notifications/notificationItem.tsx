import { NotificationEntity } from '../../../hooks/useNotifications'
import { ListItem, Stack, Typography } from '@mui/material'
import LensIcon from '@mui/icons-material/Lens'

type Props = {
  notification: NotificationEntity
}

const NotificationItem = ({ notification }: Props) => {
  const { date, message, type, id, requestId, isRead } = notification

  return (
    <ListItem sx={{ p: 1, pb: 0, position: 'relative' }}>
      <Stack width={'100%'}>
        <LensIcon
          color={isRead ? 'disabled' : 'info'}
          sx={{ position: 'absolute', fontSize: '10px', right: 0, mx: 1 }}
        />
        <Typography variant={'subtitle2'}>Title of notes</Typography>
        <Typography variant={'caption'}>{message}</Typography>
        <Typography variant={'caption'} sx={{ opacity: '75%', textTransform: 'capitalize' }}>
          {type} - {date}
        </Typography>
      </Stack>
    </ListItem>
  )
}

export default NotificationItem
