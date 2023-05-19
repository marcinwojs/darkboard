import { Box, Button, Container, Link, Stack, Typography, useTheme } from '@mui/material'
import useAuthorization from '../hooks/useAuthorization'
import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useUserContext } from '../providers/firebaseUserProvider'
import Avatar from '@mui/material/Avatar'

type Props = {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  const { user } = useUserContext()
  const theme = useTheme()
  const { logout } = useAuthorization()
  const navigate = useNavigate()
  const onLogout = () => {
    logout().then(() => {
      navigate('/', { replace: true })
    })
  }

  return (
    <Box height={'100vh'} width={'100vw'}>
      <Stack
        direction={'row'}
        bgcolor={theme.palette.secondary.dark}
        alignItems={'center'}
        px={2}
        height={'60px'}
      >
        <Link href={'/'} sx={{ display: 'flex' }}>
          <img src={'/logo.png'} height={'35px'} alt={'logo'} />
        </Link>
        {user ? (
          <Stack direction={'row'} spacing={3} p={2}>
            <Link href={'/boards'} variant={'h5'} underline={'none'}>
              Boards
            </Link>
            <Link href={'/users'} variant={'h5'} underline={'none'}>
              user
            </Link>
          </Stack>
        ) : null}
        <Stack sx={{ marginLeft: 'auto' }} direction={'row'} spacing={2}>
          {user ? (
            <>
              <Stack direction={'row'} alignItems={'center'}>
                <Avatar alt={user?.firstName} src={user?.photo}>
                  {user?.photo ? null : user?.firstName[0] || null}
                </Avatar>
                <Typography variant={'h5'} color={theme.palette.primary.main} px={1}>
                  {user?.firstName}
                </Typography>
                <Button onClick={onLogout}>
                  <Typography variant={'h6'}>Logout</Typography>
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Link href={'/login'} variant={'h5'} underline={'none'}>
                Login
              </Link>
              <Link href={'/register'} variant={'h5'} underline={'none'}>
                Register
              </Link>
            </>
          )}
        </Stack>
      </Stack>
      <Container
        maxWidth={false}
        sx={{ height: 'inherit', bgcolor: theme.palette.grey['400'] }}
        disableGutters
      >
        {children}
      </Container>
    </Box>
  )
}

export default LayoutWrapper
