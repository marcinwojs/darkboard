import { FormEvent, useState } from 'react'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Stack, IconButton, InputAdornment, TextField, Button, Typography } from '@mui/material'
import UseAuthorization from '../../../hooks/useAuthorization'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = UseAuthorization()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    signIn({ email, password })
      .then(() => {
        navigate('/', { replace: true })
      })
      .catch((error) => {
        setError(error.code)
      })
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack spacing={3} mb={3}>
          <TextField
            type={'email'}
            name='email'
            label='Email address'
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <TextField
            name='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            onChange={(event) => setPassword(event.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            required
          />
        </Stack>

        <Button fullWidth size='large' type='submit' variant='contained'>
          Login
        </Button>
      </form>
      <Typography my={2} color={'red'}>
        {error}
      </Typography>
    </>
  )
}

export default LoginForm
