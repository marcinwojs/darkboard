import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import { useState, MouseEvent, memo } from 'react'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import CropFreeIcon from '@mui/icons-material/CropFree'
const ViewModeToggle = () => {
  const [viewMode, setViewMode] = useState('focus')

  const handleChange = (event: MouseEvent<HTMLElement>, newAlignment: string) => {
    setViewMode(newAlignment)
  }

  return (
    <ToggleButtonGroup value={viewMode} exclusive onChange={handleChange}>
      <Tooltip title={'Fullscreen'} sx={{ width: '100%' }}>
        <ToggleButton sx={{ py: 0 }} value='fullscreen' selected={viewMode === 'fullscreen'}>
          <CropFreeIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Focus mode'}>
        <ToggleButton sx={{ py: 0 }} value='focus' selected={viewMode === 'focus'}>
          <CenterFocusStrongIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Regular'}>
        <ToggleButton sx={{ py: 0 }} value='regular' selected={viewMode === 'regular'}>
          <WebAssetIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  )
}

export default memo(ViewModeToggle)
