import {
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
  Paper,
  Popper,
  Typography,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { NotificationEntity } from '../../../hooks/useNotifications'
import { useUserContext } from '../../../providers/firebaseUserProvider'
import ClearIcon from '@mui/icons-material/Clear'

const Notifications = () => {
  const { user } = useUserContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [notifications, setNotifications] = useState<NotificationEntity[]>([])
  const [newNotifications, setNewNotifications] = useState<number>(0)

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'notifications', user.id), (doc) => {
        const data = doc.data()

        if (data) {
          const unreadNotifications = data.notifications.filter(
            (item: NotificationEntity) => !item.isRead,
          )

          setNotifications(data.notifications)
          setNewNotifications(unreadNotifications.length)
        }
      })

      return unsub
    }
  }, [user])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box mx={2}>
      <IconButton onClick={handleClick}>
        <Badge
          badgeContent={newNotifications}
          color='primary'
          componentsProps={{ badge: { style: { margin: '3px' } } }}
        >
          <NotificationsIcon sx={{ fontSize: '30px' }} />
        </Badge>
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={'bottom-end'}
        sx={{ zIndex: 3 }}
        transition
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Fade {...TransitionProps} timeout={350}>
              <Paper sx={{ minWidth: '200px', mx: 2, minHeight: '250px', position: 'relative' }}>
                <Typography variant={'h6'} px={1}>
                  Notifications
                </Typography>
                <IconButton
                  onClick={handleClose}
                  sx={{ p: 0, position: 'absolute', right: 0, top: 0, m: 0.5 }}
                >
                  <ClearIcon />
                </IconButton>
                <Divider />
                <List>
                  {notifications.length ? (
                    notifications.map(({ id, message }) => (
                      <React.Fragment key={id}>
                        <ListItem>
                          <Typography fontSize={'small'}>{message}</Typography>
                        </ListItem>
                        <Divider sx={{ mx: 1 }} />
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography textAlign={'center'}>No Notifications</Typography>
                  )}
                </List>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  )
}

export default Notifications
