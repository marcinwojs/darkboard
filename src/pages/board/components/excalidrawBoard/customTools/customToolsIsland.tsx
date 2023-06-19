import { Box, BoxProps, ClickAwayListener } from '@mui/material'
import NoteIcon from '@mui/icons-material/Note'
import StickyNote from './stickyNote'
import React, { useState, ReactNode } from 'react'
import TooltipButton, {
  TooltipButtonProps,
} from '../../../../../shared/components/tooltipButton/tooltipButton'

type Props = TooltipButtonProps & {
  containerProps?: BoxProps
  menuContent: ReactNode
  children: ReactNode
}

const TestComponent = ({ children, containerProps, menuContent, tipText, ...btnProps }: Props) => {
  const [showContainer, setShowContainer] = useState(false)

  const handleButtonClick = () => {
    setShowContainer(!showContainer)
  }

  return (
    <Box style={{ position: 'relative' }}>
      <TooltipButton tipText={tipText} {...btnProps} onClick={handleButtonClick}>
        {children}
      </TooltipButton>
      {showContainer && (
        <ClickAwayListener onClickAway={() => setShowContainer(false)}>
          <Box
            sx={{
              backgroundColor: 'var(--sidebar-bg-color)',
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

type Props1 = {
  injected?: boolean
}

const CustomToolsIsland = ({ injected = false }: Props1) => {
  return (
    <Box
      sx={
        !injected
          ? {
              border: '1px solid var(--sidebar-border-color)',
              borderRight: 'none',
              bgcolor: 'var(--sidebar-bg-color)',
              position: 'absolute',
              top: 'calc(10rem - var(--editor-container-padding))',
              right: 'calc(var(--editor-container-padding) * -1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: '10',
              borderTopLeftRadius: 'var(--border-radius-lg)',
              borderBottomLeftRadius: 'var(--border-radius-lg)',
            }
          : {}
      }
    >
      <TestComponent
        tipText={'Sticky Notes'}
        menuContent={
          <>
            <StickyNote />
            <StickyNote />
            <StickyNote />
            <StickyNote />
          </>
        }
      >
        <NoteIcon />
      </TestComponent>
    </Box>
  )
}

export default CustomToolsIsland
