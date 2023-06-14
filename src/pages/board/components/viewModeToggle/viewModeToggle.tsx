import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  ToggleButtonProps,
  Tooltip,
} from '@mui/material'
import { MouseEvent, memo } from 'react'
import { WebAsset, CropFree, CropDin } from '@mui/icons-material'
import { HeaderMode, useAppLayoutContext } from '../../../../providers/appLayoutProvider'

type Props = ToggleButtonGroupProps & {
  toggleButtonProps?: Partial<ToggleButtonProps>
}

const ViewModeToggle = ({ toggleButtonProps, ...groupProps }: Props) => {
  const { headerMode, changeHeaderMode } = useAppLayoutContext()

  const handleChange = (event: MouseEvent<HTMLElement>, mode: HeaderMode) => {
    if (mode !== null) {
      changeHeaderMode(mode)
    }
  }

  const fullscreenRequest = () => document.documentElement.requestFullscreen()

  return (
    <ToggleButtonGroup {...groupProps} value={headerMode} exclusive onChange={handleChange}>
      <Tooltip title={'Show header'}>
        <ToggleButton
          sx={{ py: 0 }}
          selected={headerMode === 'regular'}
          {...toggleButtonProps}
          value='regular'
        >
          <WebAsset fontSize={'inherit'} />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Hide header'}>
        <ToggleButton
          sx={{ py: 0 }}
          selected={headerMode === 'focus'}
          {...toggleButtonProps}
          value='focus'
        >
          <CropDin fontSize={'inherit'} />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Fullscreen'} sx={{ width: '100%' }}>
        <ToggleButton
          sx={{ py: 0 }}
          id={'fullscreenBtn'}
          selected={headerMode === 'fullscreen'}
          onClick={fullscreenRequest}
          {...toggleButtonProps}
          value='fullscreen'
        >
          <CropFree fontSize={'inherit'} />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  )
}

export default memo(ViewModeToggle)
