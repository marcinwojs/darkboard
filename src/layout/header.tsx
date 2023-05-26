import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import useAuthorization from '../hooks/useAuthorization'
import { useNavigate } from 'react-router-dom'
import { MouseEvent, useState } from 'react'
import { useUserContext } from '../providers/firebaseUserProvider'
import Avatar from '@mui/material/Avatar'
import Logo from './logo'

const Header = () => {
  const { user } = useUserContext()
  const { logout } = useAuthorization()
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleNavigate = (path: string) => {
    handleCloseNavMenu()
    navigate(path)
  }
  const onLogout = () => {
    handleCloseNavMenu()
    logout().then(() => {
      navigate('/', { replace: true })
    })
  }
  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar variant='dense' color='white' sx={{py: 5}}>
          <Logo sx={{ display: { xs: 'none', md: 'flex' }, mr: 5 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <Button onClick={() => handleNavigate('/')} sx={{display: 'block' }}>
                <Typography fontWeight={'bold'}>Home</Typography>
              </Button>
              {user ? (
                <Button onClick={() => handleNavigate('/boards')} sx={{ display: 'block' }}>
                  <Typography fontWeight={'bold'}>Boards</Typography>
                </Button>
              ) : null}
            </Menu>
          </Box>
          <Logo
            sx={{
              mr: 1,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
            }}
          />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => handleNavigate('/')}
              sx={{ color: 'inherit', display: 'block' }}
            >
              <Typography fontWeight={'bold'}>Home</Typography>
            </Button>

            {user ? (
              <Button
                onClick={() => handleNavigate('/boards')}
                sx={{ color: 'inherit', display: 'block' }}
              >
                <Typography fontWeight={'bold'}>Boards</Typography>
              </Button>
            ) : null}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title='Open settings'>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.firstName} src={user?.photo}>
                      {user?.photo ? null : user?.firstName[0] || null}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={onLogout}>
                    <Typography textAlign='center'>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
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
                  sx={{ ml: 2 }}
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
