import { Box, BoxProps, ClickAwayListener } from '@mui/material'
import React, { useState, ReactNode } from 'react'
import TooltipButton, {
  TooltipButtonProps,
} from '../../../../shared/components/tooltipButton/tooltipButton'

type Props1 = TooltipButtonProps & {
  containerProps?: BoxProps
  menuContent: ReactNode
  children: ReactNode
}

const CustomToolsIsland = ({
  children,
  menuContent,
  containerProps,
  tipText,
  ...buttonProps
}: Props1) => {
  const [showContainer, setShowContainer] = useState(false)

  const handleButtonClick = () => {
    setShowContainer(!showContainer)
  }

  return (
    <Box style={{ position: 'relative' }}>
      <TooltipButton tipText={tipText} size={'small'} {...buttonProps} onClick={handleButtonClick}>
        {children}
      </TooltipButton>
      {showContainer && (
        <ClickAwayListener onClickAway={() => setShowContainer(false)}>
          <Box
            sx={{
              backgroundColor: 'var(--sidebar-bg-color)',
              border: '1px solid var(--sidebar-border-color)',
              borderRadius: 'var(--border-radius-lg)',
              position: 'absolute',
              left: '-100px',
              top: '50%',
              boxShadow: 'var(--shadow-island)',
              transform: 'translateY(-50%)',
              padding: '10px',
            }}
            {...containerProps}
          >
            {menuContent}
          </Box>
        </ClickAwayListener>
      )}
    </Box>
  )
}

export default CustomToolsIsland
