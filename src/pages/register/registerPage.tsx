import { Link, Typography, Stack, CardHeader, Card, CardContent } from '@mui/material'
import React from 'react'
import RegisterForm from './components/registerForm'

const RegisterPage = (): JSX.Element => {
  return (
    <Stack alignItems={'center'} justifyContent={'center'}>
      <Card sx={{ p: 2, mt: 10 }}>
        <CardHeader
          title='Create account'
          subheader={
            <Typography variant='body2' sx={{ mb: 1 }}>
              Do you have account already?
              <Link variant='subtitle2' href={'login'} mx={1}>
                Login
              </Link>
            </Typography>
          }
        />
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </Stack>
  )
}

export default RegisterPage
