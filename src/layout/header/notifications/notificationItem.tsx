import { NotificationEntity } from '../../../hooks/useNotifications'
import { ListItem, Stack, Tooltip, Typography } from '@mui/material'
import LensIcon from '@mui/icons-material/Lens'
import { convertToObjectDate, getRelativeDate } from '../../../shared/utils'
import { format } from 'date-fns'

type Props = {
  notification: NotificationEntity
}

const NotificationItem = ({ notification }: Props) => {
  const { date, message, type, isRead } = notification
  const relativeDate = getRelativeDate({ date })
  const specificDateTip = format(convertToObjectDate(date), 'dd-MMMM-yyyy HH:mm:ss')

  return (
    <ListItem sx={{ p: 1, pb: 0, position: 'relative' }}>
      <Stack width={'100%'}>
        <LensIcon
          color={isRead ? 'disabled' : 'info'}
          sx={{ position: 'absolute', fontSize: '10px', right: 0, mx: 1 }}
        />
        <Typography variant={'subtitle2'}>Title of notes</Typography>
        <Typography variant={'caption'}>{message}</Typography>
        <Stack flexDirection={'row'} sx={{ opacity: '75%', textTransform: 'capitalize' }}>
          <Typography variant={'caption'}>{`${type} - `}</Typography>
          <Tooltip title={specificDateTip}>
            <Typography variant={'caption'} mx={1}>
              {`${relativeDate} ago`}
            </Typography>
          </Tooltip>
        </Stack>
      </Stack>
    </ListItem>
  )
}

export default NotificationItem
