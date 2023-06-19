import ViewModeToggle from '../viewModeToggle/viewModeToggle'
import ShareButton from '../shareButton/shareButton'
import { Box, Stack } from '@mui/material'
import { useDevice } from '@excalidraw/excalidraw'
import InjectBefore from '../../../../shared/helpers/injectBefore'
import StickyNotes from './customTools/stickyNotes'

type Props = {
  instanceId: string
}

const AdditionalButtons = ({ instanceId }: Props) => {
  const { isMobile } = useDevice()
  const toInject = document.querySelector('.mobile-misc-tools-container')

  if (isMobile && toInject) {
    return (
      <>
        <InjectBefore
          component={
            <Stack flexDirection={'column'}>
              <ViewModeToggle
                sx={{ flexDirection: 'column' }}
                toggleButtonProps={{
                  sx: {
                    borderRadius: 0,
                    border: 'none',
                    minWidth: '36px',
                    px: 0,
                    py: 1.3,
                    fontSize: '16px',
                    color: 'var(--icon-fill-color)',
                  },
                  size: 'small',
                }}
              />
              <ShareButton id={instanceId} sx={{ minWidth: '36px', px: 0, fontSize: '16px' }} />
              <StickyNotes />
            </Stack>
          }
          container={toInject}
        />
      </>
    )
  }

  return (
    <Stack direction={'row'} spacing={1.5}>
      <ViewModeToggle toggleButtonProps={{ sx: { height: '36px', fontSize: '24px' } }} />
      <ShareButton id={instanceId} sx={{ height: '36px', fontSize: '24px' }} />
      <Box
        sx={{
          border: '1px solid var(--sidebar-border-color)',
          borderRight: 'none',
          bgcolor: 'var(--sidebar-bg-color)',
          position: 'absolute',
          top: 'calc(12rem - var(--editor-container-padding))',
          right: 'calc(var(--editor-container-padding) * -1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: '10',
          borderTopLeftRadius: 'var(--border-radius-lg)',
          borderBottomLeftRadius: 'var(--border-radius-lg)',
        }}
      >
        <StickyNotes />
      </Box>
    </Stack>
  )
}

export default AdditionalButtons
