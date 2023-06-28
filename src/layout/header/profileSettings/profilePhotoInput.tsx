import { Badge, Box, CircularProgress, Snackbar, Stack, Typography } from '@mui/material'
import TooltipButton from '../../../shared/components/tooltipButton/tooltipButton'
import EditIcon from '@mui/icons-material/Edit'
import Avatar from '@mui/material/Avatar'
import React, { useState } from 'react'
import { useUserContext } from '../../../providers/firebaseUserProvider'
import useFirestoreUser from '../../../hooks/useFirestoreUser'
import { setWithTransition } from '../../../shared/helpers/helpers'
import { styled } from '@mui/material/styles'

const StyledMaskBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  background: theme.palette.background.paper,
  borderRadius: '50%',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiCircularProgress-root ': {
    color: 'primary',
    position: 'absolute',
    zIndex: 1,
  },
}))

const AvatarBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    width: '25px',
    height: '25px',
    padding: 0,
  },
  '& .MuiAvatar-root': {
    width: 70,
    height: 70,
    border: '2px solid',
    borderColor: theme.palette.background.paper,
  },
}))

const ProfilePhotoInput = () => {
  const { user } = useUserContext()
  const { changeUserPhoto } = useFirestoreUser()
  const uploadRef = React.useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const UploadFile = () => {
    if (uploadRef.current?.files && user) {
      const file = uploadRef.current.files[0]
      return changeUserPhoto(
        user.id,
        file,
        (loadingState) => setWithTransition(() => setLoading(loadingState)),
        (progressState) => setProgress(progressState),
        (error) => setError(error.message),
      )
    }
  }

  const handleClickEdit = () => {
    if (uploadRef.current) uploadRef.current.click()
  }

  return (
    <div>
      <Stack justifyContent={'center'} alignItems={'center'}>
        <Typography mb={1} variant={'subtitle2'}>
          Profile Photo
        </Typography>
        <AvatarBadge
          overlap='circular'
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          color={'primary'}
          badgeContent={
            !loading ? (
              <TooltipButton onClick={handleClickEdit} tipText={'Change profile photo'}>
                <EditIcon fontSize={'small'} />
              </TooltipButton>
            ) : null
          }
        >
          <Avatar alt={user?.firstName} src={user?.photo}>
            {user?.photo ? null : user?.firstName[0] || null}
          </Avatar>
          {loading ? (
            <StyledMaskBox>
              <CircularProgress variant='determinate' value={55} size={71} />
              <Typography fontSize={'large'} color='inherit'>{`${Math.round(
                progress,
              )}%`}</Typography>
            </StyledMaskBox>
          ) : null}
        </AvatarBadge>
      </Stack>
      <input
        style={{ display: 'none' }}
        type='file'
        name='file'
        ref={uploadRef}
        onChange={UploadFile}
        accept={'image/*'}
      />
      <Snackbar
        open={Boolean(error)}
        onClose={() => setError('')}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        message={error}
      />
    </div>
  )
}

export default ProfilePhotoInput
