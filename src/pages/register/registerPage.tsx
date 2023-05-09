import { styled } from '@mui/material/styles'
import { Link, Container, Typography } from '@mui/material'
import React from 'react'
import RegisterForm from './components/registerForm'

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}))

const RegisterPage = (): JSX.Element => {
  return (
    <Container maxWidth='sm'>
      <StyledContent>
        <Typography variant='h4' gutterBottom>
          Create account
        </Typography>
        <Typography variant='body2' sx={{ mb: 2 }}>
          Do you have account already?
          <Link variant='subtitle2' href={'login'} mx={1}>
            Login
          </Link>
        </Typography>
        <RegisterForm />
      </StyledContent>
    </Container>
  )
}

export default RegisterPage
