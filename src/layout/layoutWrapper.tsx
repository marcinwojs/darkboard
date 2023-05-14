import { Button, Container, Link, Stack, Typography, useTheme } from '@mui/material'
import useAuthorization from '../hooks/useAuthorization'
import { useNavigate } from 'react-router-dom'
import {ReactNode, useContext, useEffect, useLayoutEffect} from 'react'
import { FirebaseUserContext, FirebaseUserContextType } from '../providers/firebaseUserProvider'
import Avatar from '@mui/material/Avatar'
import { auth } from '../config/firebase'

type Props = {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  const { user } = useContext(FirebaseUserContext) as FirebaseUserContextType
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
      <Stack direction={'row'} bgcolor={theme.palette.grey['400']} justifyContent={'space-around'}>
        <Stack direction={'row'} spacing={3} p={2}>
          <Link href={'/'} variant={'h5'}>
            LoginPage
          </Link>
          <Link href={'/register'} variant={'h5'}>
            Register
          </Link>
          <Link href={'/boards'} variant={'h5'}>
            Boards
          </Link>
          <Link href={'/users'} variant={'h5'}>
            user
          </Link>
        </Stack>
        <Stack direction={'row'} spacing={4}>
          <Stack direction={'row'} alignItems={'center'}>
            <Avatar alt={user?.firstName} src={user?.photo}>
              {user?.photo ? null : user?.firstName[0] || null}
            </Avatar>
            <Typography variant={'h5'}>{user?.firstName}</Typography>
          </Stack>
          <Button>
            <Typography variant={'h6'} onClick={onLogout}>
              LOGOUT
            </Typography>
          </Button>
        </Stack>
      </Stack>
      <Container maxWidth={false} sx={{ height: 'inherit' }} disableGutters>
        {children}
      </Container>
    </Stack>
  )
}

export default LayoutWrapper
