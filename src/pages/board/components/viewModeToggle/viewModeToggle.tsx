import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import { MouseEvent, memo } from 'react'
import { WebAsset, CropFree, CropDin } from '@mui/icons-material'
import { HeaderMode, useAppLayoutContext } from '../../../../providers/appLayoutProvider'

const ViewModeToggle = () => {
  const { headerMode, changeHeaderMode } = useAppLayoutContext()

  const handleChange = (event: MouseEvent<HTMLElement>, mode: HeaderMode) => {
    if (mode !== null) {
      changeHeaderMode(mode)
    }
  }

  const fullscreenRequest = () => document.documentElement.requestFullscreen()

  return (
    <ToggleButtonGroup value={headerMode} exclusive onChange={handleChange}>
      <Tooltip title={'Show header'}>
        <ToggleButton sx={{ py: 0 }} value='regular' selected={headerMode === 'regular'}>
          <WebAsset />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Hide header'}>
        <ToggleButton sx={{ py: 0 }} value='focus' selected={headerMode === 'focus'}>
          <CropDin />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Fullscreen'} sx={{ width: '100%' }}>
        <ToggleButton
          id={'fullscreenBtn'}
          sx={{ py: 0 }}
          value='fullscreen'
          selected={headerMode === 'fullscreen'}
          onClick={fullscreenRequest}
        >
          <CropFree />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  )
}

export default memo(ViewModeToggle)
