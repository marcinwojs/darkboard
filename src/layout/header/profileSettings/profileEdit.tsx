import { Stack } from '@mui/material'

import React from 'react'
import ProfilePhotoInput from './profilePhotoInput'

const ProfileEdit = () => {
  return (
    <Stack justifyContent={'start'} alignItems={'start'}>
      <ProfilePhotoInput />
    </Stack>
  )
}

export default ProfileEdit
