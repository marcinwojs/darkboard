import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import { MouseEvent, memo } from 'react'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import CropFreeIcon from '@mui/icons-material/CropFree'
import { HeaderMode, useAppLayoutContext } from '../../../../providers/appLayoutProvider'

const ViewModeToggle = () => {
  const { headerMode, changeHeaderMode } = useAppLayoutContext()

  const handleChange = (event: MouseEvent<HTMLElement>, mode: HeaderMode) => {
    changeHeaderMode(mode)
  }

  const fullscreenRequest = () => document.documentElement.requestFullscreen()

  return (
    <ToggleButtonGroup value={headerMode} exclusive onChange={handleChange}>
      <Tooltip title={'Fullscreen'} sx={{ width: '100%' }}>
        <ToggleButton
          id={'fullscreenBtn'}
          sx={{ py: 0 }}
          value='fullscreen'
          selected={headerMode === 'fullscreen'}
          onClick={fullscreenRequest}
        >
          <CropFreeIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Focus mode'}>
        <ToggleButton sx={{ py: 0 }} value='focus' selected={headerMode === 'focus'}>
          <CenterFocusStrongIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Regular'}>
        <ToggleButton sx={{ py: 0 }} value='regular' selected={headerMode === 'regular'}>
          <WebAssetIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  )
}

export default memo(ViewModeToggle)
