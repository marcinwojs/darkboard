import { styled } from '@mui/material/styles'
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import LoginForm from './components/loginForm'
import { signInWithGoogle } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}))

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate()

  const onSignGoogle = () => {
    signInWithGoogle().then(() => {
      navigate('/', { replace: true })
    })
  }

  return (
    <Container maxWidth='sm'>
      <StyledContent>
        <Typography variant='h4' gutterBottom>
          Sign in with firebase auth
        </Typography>

        <Typography variant='body2' sx={{ mb: 5 }}>
          Don’t have an account?
          <Link variant='subtitle2' href={'/register'} mx={1}>
            Get started
          </Link>
        </Typography>

        <Stack direction='row' spacing={2}>
          <Button fullWidth size='large' color='inherit' variant='outlined' onClick={onSignGoogle}>
            <GoogleIcon />
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }}>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            OR
          </Typography>
        </Divider>

        <LoginForm />
      </StyledContent>
    </Container>
  )
}

export default LoginPage
