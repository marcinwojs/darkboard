import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import useAuthorization from '../../hooks/useAuthorization'
import { useLocation, useNavigate } from 'react-router-dom'
import { MouseEvent, useState } from 'react'
import { useUserContext } from '../../providers/firebaseUserProvider'
import Avatar from '@mui/material/Avatar'
import Logo from '../logo'
import DarkModeSwitcher from '../darkModeSwitcher'
import { isCurrentPage } from '../../shared/utils'
import { styled } from '@mui/material/styles'
import UserProfileMenu from './userMenu'
import SmallLogo from '../smallLogo'

const HighlightTypography = styled(Typography)`
  font-weight: bold;
  &.current {
    filter: invert(1);
  }
`

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false)

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setOpenDrawer(open)
  }

  const { pathname } = useLocation()
  const { user } = useUserContext()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <AppBar position='static'>
      <Container maxWidth={false} disableGutters>
        <Toolbar variant='dense' sx={{ height: '70px', justifyContent: 'center' }}>
          <SmallLogo
            sx={{
              display: { md: 'none' },
              position: 'absolute',
              height: '35px',
            }}
            imgHeight={'35px'}
          />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={toggleDrawer(!openDrawer)}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Drawer anchor={'left'} open={openDrawer} onClose={toggleDrawer(false)}>
              <Logo
                imgHeight={'20px'}
                sx={{
                  m: 1,
                  flexGrow: 1,
                }}
              />
              <Divider variant={'middle'} sx={{ mb: 1 }} />
              <Box sx={{ pl: 1 }}>
                <DarkModeSwitcher />
              </Box>
              <Divider variant={'middle'} sx={{ my: 1 }} />
              <Button onClick={() => handleNavigate('/')} sx={{ display: 'block', pl: 2 }}>
                <HighlightTypography
                  className={(isCurrentPage('/', pathname) && 'current') || undefined}
                >
                  Home
                </HighlightTypography>
              </Button>
              {user ? (
                <>
                  <Divider variant={'middle'} />
                  <Button onClick={() => handleNavigate('/boards')} sx={{ display: 'block' }}>
                    <HighlightTypography
                      className={(isCurrentPage('/boards', pathname) && 'current') || undefined}
                    >
                      Boards
                    </HighlightTypography>
                  </Button>
                </>
              ) : null}
            </Drawer>
          </Box>
          <Logo
            sx={{
              mr: 1,
              display: { xs: 'none', md: 'block' },
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button onClick={() => handleNavigate('/')} sx={{ color: 'inherit', display: 'block' }}>
              <HighlightTypography
                className={(isCurrentPage('/', pathname) && 'current') || undefined}
              >
                Home
              </HighlightTypography>
            </Button>

            {user ? (
              <Button
                onClick={() => handleNavigate('/boards')}
                sx={{ color: 'inherit', display: 'block' }}
              >
                <HighlightTypography
                  className={(isCurrentPage('/boards', pathname) && 'current') || undefined}
                >
                  Boards
                </HighlightTypography>
              </Button>
            ) : null}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <DarkModeSwitcher />
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <UserProfileMenu user={user} />
            ) : (
              <>
                <Button
                  sx={{ ml: 2 }}
                  color='inherit'
                  variant='outlined'
                  onClick={() => handleNavigate('/login')}
                >
                  Login
                </Button>
                <Button
                  sx={{ ml: 2, display: { xs: 'none', md: 'inline-flex' } }}
                  color='inherit'
                  variant='outlined'
                  onClick={() => handleNavigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
