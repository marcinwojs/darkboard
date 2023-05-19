import { styled } from '@mui/material/styles'
import { Container, Typography, Divider, Stack, Button } from '@mui/material'
import UserList, { UserEntity } from './components/userList'
import useFirestore from '../../hooks/useFirestore'
import { useEffect, useState } from 'react'
import { useUserContext } from '../../providers/firebaseUserProvider'
import useAuthorization from '../../hooks/useAuthorization'
import { useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}))

const HomePage = (): JSX.Element => {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { getCollection } = useFirestore()
  const { logout } = useAuthorization()
  const [users, setUsers] = useState<UserEntity[]>([])

  useEffect(() => {
    getCollection({ collectionId: 'users' }).then((value) => {
      if (value) setUsers(value as UserEntity[])
    })
  }, [])

  const onLogout = () => {
    logout().then(() => {
      navigate('/login', { replace: true })
    })
  }

  console.log(user)
  return (
    <Container maxWidth='sm'>
      <StyledContent>
        <Typography variant='h4' gutterBottom alignSelf={'center'}>
          Current User
        </Typography>
        <Stack alignItems={'center'}>
          <Avatar alt={user?.firstName} src={user?.photo}>
            {user?.photo ? null : user?.firstName[0] || null}
          </Avatar>
          <Typography variant={'h5'}>{user?.firstName}</Typography>
          <Typography variant={'h6'}>{user?.email}</Typography>
          <Button onClick={onLogout}>Logout</Button>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography variant='h5' alignSelf={'center'}>
          User list
        </Typography>
        <UserList users={users} />
      </StyledContent>
    </Container>
  )
}

export default HomePage
