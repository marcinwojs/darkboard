import { Stack } from '@mui/material'
import React, { memo } from 'react'
import { CropDin, CropFree, WebAsset } from '@mui/icons-material'
import { HeaderMode, useAppLayoutContext } from '../../../../providers/appLayoutProvider'
import TooltipButton from '../../../../shared/components/tooltipButton/tooltipButton'
import { styled } from '@mui/material/styles'

const StyledIconButton = styled(Stack)({
  overflow: 'hidden',
})

type Props = {
  mobile?: boolean
}

const ViewModeToggle = ({ mobile = false }: Props) => {
  const { headerMode, changeHeaderMode } = useAppLayoutContext()

  const handleChange = (mode: HeaderMode) => {
    if (mode !== null) {
      changeHeaderMode(mode)
    }
  }

  const fullscreenRequest = () => document.documentElement.requestFullscreen()

  return (
    <StyledIconButton
      sx={{
        flexDirection: mobile ? 'column' : 'row',
        borderRadius: mobile ? 0 : 'var(--border-radius-lg)',
      }}
    >
      <TooltipButton
        sx={{
          borderTopLeftRadius: 'var(--border-radius-lg)',
          ...(!mobile && {
            borderRadius: 0,
            borderBottomLeftRadius: 'var(--border-radius-lg)',
          }),
        }}
        mobile={mobile}
        className={`${headerMode === 'regular' ? 'selected' : ''}`}
        tipText={'Show header'}
        onClick={() => handleChange(HeaderMode.regular)}
      >
        <WebAsset fontSize={'inherit'} />
      </TooltipButton>
      <TooltipButton
        sx={{ borderRadius: 0 }}
        mobile={mobile}
        className={`${headerMode === 'focus' ? 'selected' : ''}`}
        tipText={'Hide header'}
        onClick={() => handleChange(HeaderMode.focus)}
      >
        <CropDin fontSize={'inherit'} />
      </TooltipButton>
      <TooltipButton
        sx={
          !mobile
            ? {
                borderRadius: 0,
                borderTopRightRadius: 'var(--border-radius-lg)',
                borderBottomRightRadius: 'var(--border-radius-lg)',
              }
            : {}
        }
        mobile={mobile}
        id={'fullscreenBtn'}
        className={`${headerMode === 'fullscreen' ? 'selected' : ''}`}
        tipText={'Show header'}
        onClick={fullscreenRequest}
      >
        <CropFree fontSize={'inherit'} />
      </TooltipButton>
    </StyledIconButton>
  )
}

export default memo(ViewModeToggle)
