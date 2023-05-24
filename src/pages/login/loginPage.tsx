import {
  Link,
  Card,
  Typography,
  Divider,
  Stack,
  Button,
  CardHeader,
  CardContent,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import LoginForm from './components/loginForm'
import { signInWithGoogle } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserContext } from '../../providers/firebaseUserProvider'
import useFirestoreUser from '../../hooks/useFirestoreUser'

const LoginPage = (): JSX.Element => {
  const { addUser, getUserData } = useFirestoreUser()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (user) {
      navigate('/boards', { replace: true })
    }
  })

  const onSignGoogle = () => {
    signInWithGoogle().then(({ user }) => {
      const { uid, email, displayName } = user
      getUserData(uid).catch(() => {
        addUser({
          email: email || 'gmail',
          id: uid,
          firstName: displayName || 'name',
          userBoards: [],
        })
      })
      navigate('/boards', { replace: true })
    })
  }

  return (
    <Stack alignItems={'center'} justifyContent={'center'}>
      <Card sx={{ p: 2, mt: 10 }}>
        <CardHeader
          title='Sign in with firebase auth'
          subheader={
            <Typography variant='subtitle2' sx={{ pt: 2 }}>
              Don’t have an account?
              <Link variant='subtitle2' href={'/register'} mx={1}>
                Get started
              </Link>
            </Typography>
          }
        />

        <CardContent>
          <Stack direction='row' spacing={2}>
            <Button
              fullWidth
              size='large'
              color='inherit'
              variant='outlined'
              onClick={onSignGoogle}
            >
              <GoogleIcon />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          <LoginForm />
        </CardContent>
      </Card>
    </Stack>
  )
}

export default LoginPage
