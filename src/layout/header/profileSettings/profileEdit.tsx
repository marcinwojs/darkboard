import { Stack } from '@mui/material'

import React from 'react'
import ProfilePictureInput from './profilePictureInput'

const ProfileEdit = () => {
  return (
    <Stack justifyContent={'start'} alignItems={'start'}>
      <ProfilePictureInput />
    </Stack>
  )
}

export default ProfileEdit
