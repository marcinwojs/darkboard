import { Box, Dialog, DialogContent, DialogTitle, IconButton, Tab, Tabs } from '@mui/material'
import { Close } from '@mui/icons-material'
import { useState } from 'react'
import { styled } from '@mui/material/styles'
import { UserEntity } from '../../../providers/firebaseUserProvider'
import ProfileEdit from './profileEdit'

const StyledTab = styled(Tab)({
  padding: '5px',
  fontSize: '12px',
  alignItems: 'start',
  minWidth: '80px',
})

type Props = {
  open: boolean
  handleClose: () => void
  user: UserEntity
}

// TODO remove after created tabs content for user settings
const Placeholder = () => {
  return (
    <Box sx={{ width: '80%', height: '200px', bgcolor: 'background.paper', margin: 'auto', my: 1 }}>
      Placeholder
    </Box>
  )
}

const ProfileSettingsDialog = ({ open, handleClose }: Props) => {
  const [value, setValue] = useState(0)

  const handleChange = (newValue: number) => {
    setValue(newValue)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        Profile Settings
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'}>
          <Tabs
            TabIndicatorProps={{ sx: { display: 'none' } }}
            orientation='vertical'
            value={value}
            onChange={(event, value) => handleChange(value)}
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <StyledTab label='Profile' />
            <StyledTab label='Password' />
            <StyledTab label='Other' />
          </Tabs>
          <Box sx={{ flexGrow: 2, minHeight: '200px', p: 1 }} role='tabpanel' hidden={value !== 0}>
            <ProfileEdit />
          </Box>
          <Box sx={{ flexGrow: 2, minHeight: '200px' }} role='tabpanel' hidden={value !== 1}>
            <Placeholder />
          </Box>{' '}
          <Box sx={{ flexGrow: 2, minHeight: '200px' }} role='tabpanel' hidden={value !== 2}>
            <Placeholder />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileSettingsDialog
