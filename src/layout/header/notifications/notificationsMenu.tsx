import {
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  Fade,
  List,
  ListItem,
  Paper,
  Popper,
  Typography,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import TooltipButton from '../../../shared/components/tooltipButton/tooltipButton'
import React, { useState } from 'react'

const NotificationsMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box mx={2}>
      <TooltipButton tipText={'Notifications'} onClick={handleClick}>
        <Badge
          badgeContent={4}
          color='primary'
          componentsProps={{ badge: { style: { margin: '3px' } } }}
        >
          <NotificationsIcon sx={{ fontSize: '30px' }} />
        </Badge>
      </TooltipButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={'bottom-end'}
        sx={{ minWidth: '250px' }}
        transition
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography variant={'h6'} px={1}>
                  Notifications
                </Typography>
                <Divider />
                <List>
                  <ListItem>test</ListItem>
                  <ListItem>test</ListItem>
                </List>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  )
}

export default NotificationsMenu
