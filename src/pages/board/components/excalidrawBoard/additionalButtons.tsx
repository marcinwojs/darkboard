import ViewModeToggle from '../viewModeToggle/viewModeToggle'
import ShareButton from '../shareButton/shareButton'
import { Box, Stack } from '@mui/material'
import { useDevice } from '@excalidraw/excalidraw'
import InjectBefore from '../../../../shared/helpers/injectBefore'
import StickyNotes from './customTools/stickyNotes'
import { styled } from '@mui/material/styles'

const DesktopCustomToolIsland = styled(Box)(() => ({
  border: '1px solid var(--sidebar-border-color)',
  backgroundColor: 'var(--sidebar-bg-color)',
  borderRight: 'none',
  position: 'absolute',
  top: 'calc(12rem - var(--editor-container-padding))',
  right: 'calc(var(--editor-container-padding) * -1)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: '10',
  py: 3,
  padding: '3px 0px',
  borderTopLeftRadius: 'var(--border-radius-lg)',
  borderBottomLeftRadius: 'var(--border-radius-lg)',
}))

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
              <ViewModeToggle mobile />
              <ShareButton mobile id={instanceId} />
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
      <ViewModeToggle />
      <ShareButton id={instanceId} />
      <DesktopCustomToolIsland>
        <StickyNotes />
      </DesktopCustomToolIsland>
    </Stack>
  )
}

export default AdditionalButtons
