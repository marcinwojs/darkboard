import { Stack } from '@mui/material'

import React from 'react'
import ProfileUsernameInput from './profileUsernameInput'
import ProfilePhotoInput from './profilePhotoInput'

const ProfileEdit = () => {
  return (
    <Stack justifyContent={'start'} alignItems={'start'} spacing={3}>
      <ProfilePhotoInput />
      <ProfileUsernameInput />
    </Stack>
  )
}

export default ProfileEdit
