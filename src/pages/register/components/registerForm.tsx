import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Stack, IconButton, InputAdornment, TextField, Button, Typography } from '@mui/material'
import useAuthorization from '../../../hooks/useAuthorization'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userData, setUserData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const { signUp } = useAuthorization()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { email, password, firstName, confirmPassword } = userData

    if (password === confirmPassword) {
      signUp({ email, password, firstName })
        .then(() => {
          navigate('/', { replace: true })
        })
        .catch((error) => {
          setError(error.code)
        })
    } else {
      setError('Password arent the same')
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Stack spacing={2} mb={3}>
          <TextField
            type={'text'}
            name='First Name'
            label='First name'
            onChange={({ target }) => setUserData({ ...userData, firstName: target.value })}
            required
          />
          <TextField
            type={'email'}
            name='email'
            label='Email address'
            onChange={({ target }) => setUserData({ ...userData, email: target.value })}
            required
          />
          <TextField
            name='password'
            label='Password'
            type={showPassword ? 'text' : 'password'}
            onChange={({ target }) => setUserData({ ...userData, password: target.value })}
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
          <TextField
            name='Confirm password'
            label='Confirm password'
            onChange={({ target }) => setUserData({ ...userData, confirmPassword: target.value })}
            type={showPassword ? 'text' : 'password'}
            required
          />
        </Stack>

        <Button fullWidth size='large' type='submit' variant='contained'>
          Create Account
        </Button>
      </form>
      <Typography my={2} color={'red'}>
        {error}
      </Typography>
    </>
  )
}

export default RegisterForm
