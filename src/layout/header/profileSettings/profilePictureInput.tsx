import { Badge, Box, CircularProgress, Stack, Typography } from '@mui/material'
import TooltipButton from '../../../shared/components/tooltipButton/tooltipButton'
import EditIcon from '@mui/icons-material/Edit'
import Avatar from '@mui/material/Avatar'
import React, { useState } from 'react'
import { useUserContext } from '../../../providers/firebaseUserProvider'
import useFirestoreUser from '../../../hooks/useFirestoreUser'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { str } from '../../../config/firebase'
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

const ProfilePictureInput = () => {
  const { user, setUser } = useUserContext()
  const { updateUserData } = useFirestoreUser()
  const uploadRef = React.useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Nie udało się załadować obrazka.'))

      img.src = url
    })
  }

  const UploadFile = () => {
    if (uploadRef.current?.files && user) {
      const file = uploadRef.current.files[0]
      const storageRef = ref(str, user?.id)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(progress)
          switch (snapshot.state) {
            case 'running':
              setWithTransition(() => setLoading(true))
              break
          }
        },
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateUserData(user.id, { photo: downloadURL }).then(() => {
              fetchImage(downloadURL).then(() => {
                setWithTransition(() => setLoading(false))
                setUser({ ...user, photo: downloadURL })
              })
            })
          })
        },
      )
    }
  }

  const handleClickEdit = () => {
    if (uploadRef.current) {
      uploadRef.current.click()
    }
  }

  return (
    <div>
      <Stack justifyContent={'center'} alignItems={'center'}>
        <Typography mb={1} variant={'subtitle2'}>
          Profile picture
        </Typography>
        <AvatarBadge
          overlap='circular'
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          color={'primary'}
          badgeContent={
            !loading ? (
              <TooltipButton onClick={handleClickEdit} tipText={'Change profile picture'}>
                <EditIcon fontSize={'small'} />
              </TooltipButton>
            ) : null
          }
        >
          <Avatar alt={user?.firstName} src={user?.photo} />
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
      />
    </div>
  )
}

export default ProfilePictureInput
