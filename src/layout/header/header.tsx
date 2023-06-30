import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserContext } from '../../providers/firebaseUserProvider'
import Logo from '../logo'
import DarkModeSwitcher from '../darkModeSwitcher'
import { isCurrentPage } from '../../shared/utils'
import { styled } from '@mui/material/styles'
import UserProfileMenu from './userMenu'
import DrawerMenu from './drawerMenu'
import NotificationsMenu from './notifications/notificationsMenu'

const HighlightTypography = styled(Typography)`
  font-weight: bold;
  &.current {
    filter: invert(1);
  }
`

const Header = () => {
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
          <Logo
            small
            sx={{
              display: { md: 'none' },
              position: 'absolute',
              height: '35px',
            }}
            imgHeight={'35px'}
          />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <DrawerMenu />
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
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' }, px: 1 }}>
            <DarkModeSwitcher />
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <Stack flexDirection={'row'}>
                <NotificationsMenu />
                <UserProfileMenu user={user} />
              </Stack>
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
