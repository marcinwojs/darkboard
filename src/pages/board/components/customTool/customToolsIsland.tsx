import { Box, BoxProps, ClickAwayListener } from '@mui/material'
import React, { useState, ReactNode } from 'react'
import TooltipButton, {
  TooltipButtonProps,
} from '../../../../shared/components/tooltipButton/tooltipButton'
import { flushSync } from 'react-dom'

type Props = TooltipButtonProps & {
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
}: Props) => {
  const [showContainer, setShowContainer] = useState(false)

  const handleMove = (show: boolean) => {
    if ('startViewTransition' in document) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.startViewTransition(() => {
        flushSync(() => {
          setShowContainer(show)
        })
      })
    } else {
      setShowContainer(show)
    }
  }

  return (
    <Box style={{ position: 'relative' }}>
      <TooltipButton
        tipText={tipText}
        mobile
        {...buttonProps}
        onClick={() => handleMove(!showContainer)}
      >
        {children}
      </TooltipButton>
      {showContainer ? (
        <ClickAwayListener onClickAway={() => handleMove(false)}>
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
              padding: 2,
            }}
            {...containerProps}
          >
            {menuContent}
          </Box>
        </ClickAwayListener>
      ) : null}
    </Box>
  )
}

export default CustomToolsIsland
