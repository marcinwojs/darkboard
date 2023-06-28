import { IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import useAuthorization from '../../hooks/useAuthorization'
import { useNavigate } from 'react-router-dom'
import { MouseEvent, useState } from 'react'
import { UserEntity } from '../../providers/firebaseUserProvider'
import ProfileSettingsDialog from './profileSettingsDialog'

type Props = {
  user: UserEntity
}

const UserProfileMenu = ({ user }: Props) => {
  const { logout } = useAuthorization()
  const navigate = useNavigate()
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [openSettings, setOpenSettings] = useState(false)

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const onLogout = () => {
    logout().then(() => {
      navigate('/', { replace: true })
    })
  }

  return (
    <>
      <Tooltip title='Open settings'>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={user?.firstName} src={user?.photo}>
            {user?.photo ? null : user?.firstName[0] || null}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id='menu-appbar'
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={() => setOpenSettings(true)}>
          <Typography textAlign='center'>Profile Settings</Typography>
        </MenuItem>
        <MenuItem onClick={onLogout}>
          <Typography textAlign='center'>Logout</Typography>
        </MenuItem>
      </Menu>
      <ProfileSettingsDialog open={openSettings} handleClose={() => setOpenSettings(false)} />
    </>
  )
}

export default UserProfileMenu
