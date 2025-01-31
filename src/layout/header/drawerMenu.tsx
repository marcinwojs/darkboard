import Logo from '../logo'
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  IconButton,
} from '@mui/material'
import DarkModeSwitcher from '../darkModeSwitcher'
import { isCurrentPage } from '../../shared/utils'
import { useLocation, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'

const DrawerMenu = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleDrawer = (open: boolean) => () => {
    setOpenDrawer(open)
  }

  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <IconButton
        size='large'
        aria-label='mobile control menu'
        aria-controls='menu-toggler'
        aria-haspopup='true'
        onClick={toggleDrawer(!openDrawer)}
        color='inherit'
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor={'left'} open={openDrawer} onClose={toggleDrawer(false)}>
        <Logo
          imgHeight={'25px'}
          sx={{
            mx: 2.5,
            my: 2,
            height: '25px',
          }}
        />
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={isCurrentPage('/', pathname)}
              onClick={() => handleNavigate('/')}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              selected={isCurrentPage('/boards', pathname)}
              onClick={() => handleNavigate('/boards')}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={'Boards'} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ mt: 'auto' }} />
        <Box py={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <DarkModeSwitcher />
        </Box>
      </Drawer>
    </Box>
  )
}

export default DrawerMenu
