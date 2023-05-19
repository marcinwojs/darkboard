import { Button, Container, Link, Stack, Typography, useTheme } from '@mui/material'
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
    <Stack height={'100vh'} width={'100vw'}>
      <Stack direction={'row'} alignItems={'center'} px={2}>
        <Link href={'/'} variant={'h3'} color={theme.palette.primary.dark} underline={'none'}>
          Darkboard
        </Link>
        <Stack sx={{ mx: 10 }} direction={'row'} spacing={3} p={2}>
          <Link href={'/login'} variant={'h5'} underline={'none'}>
            Login
          </Link>
          <Link href={'/register'} variant={'h5'} underline={'none'}>
            Register
          </Link>
          <Link href={'/boards'} variant={'h5'} underline={'none'}>
            Boards
          </Link>
          <Link href={'/users'} variant={'h5'} underline={'none'}>
            user
          </Link>
        </Stack>
        {user ? (
          <Stack sx={{ marginLeft: 'auto' }} direction={'row'} spacing={2}>
            <Stack direction={'row'} alignItems={'center'}>
              <Avatar alt={user?.firstName} src={user?.photo}>
                {user?.photo ? null : user?.firstName[0] || null}
              </Avatar>
              <Typography variant={'h5'} color={theme.palette.primary.main} px={1}>
                {user?.firstName}
              </Typography>
            </Stack>
            <Button onClick={onLogout}>LOGOUT</Button>
          </Stack>
        ) : null}
      </Stack>
      <Container
        maxWidth={false}
        sx={{ height: 'inherit', bgcolor: theme.palette.grey['400'] }}
        disableGutters
      >
        {children}
      </Container>
    </Stack>
  )
}

export default LayoutWrapper
