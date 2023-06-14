import ViewModeToggle from '../viewModeToggle/viewModeToggle'
import ShareButton from '../shareButton/shareButton'
import { Stack } from '@mui/material'
import { useDevice } from '@excalidraw/excalidraw'
import { createPortal } from 'react-dom'

type Props = {
  instanceId: string
}

const AdditionalButtons = ({ instanceId }: Props) => {
  const { isMobile } = useDevice()

  const toInject = document.querySelector('.mobile-misc-tools-container')

  if (isMobile && toInject) {
    return (
      <>
        {createPortal(
          <>
            <ViewModeToggle
              sx={{ flexDirection: 'column' }}
              toggleButtonProps={{
                sx: {
                  borderRadius: 0,
                  border: 'none',
                  minWidth: '36px',
                  px: 0,
                  py: 1,
                  fontSize: '16px',
                  color: 'var(--icon-fill-color)',
                },
                size: 'small',
              }}
            />
            <ShareButton
              variant={'text'}
              id={instanceId}
              sx={{ minWidth: '36px', px: 0, fontSize: '16px' }}
            />
          </>,
          toInject,
        )}
      </>
    )
  }

  // ) return (
  //   <Box
  //     sx={{
  //       bgcolor: 'var(--island-bg-color)',
  //       position: 'absolute',
  //       top: 'calc(14rem - var(--editor-container-padding))',
  //       right: 'calc(var(--editor-container-padding) * -1)',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       zIndex: '10',
  //       borderTopLeftRadius: 'var(--border-radius-lg)',
  //       borderBottomLeftRadius: 'var(--border-radius-lg)',
  //     }}
  //   >
  //     <ViewModeToggle
  //       sx={{ flexDirection: 'column' }}
  //       toggleButtonProps={{
  //         sx: {
  //           border: 'none',
  //           minWidth: '36px',
  //           px: 0,
  //           py: 1,
  //           fontSize: '16px',
  //           color: 'var(--icon-fill-color)',
  //         },
  //         size: 'small',
  //       }}
  //     />
  //     <ShareButton
  //       variant={'text'}
  //       id={instanceId}
  //       sx={{ minWidth: '36px', px: 0, fontSize: '16px' }}
  //     />
  //   </Box>
  // )

  return (
    <Stack direction={'row'} spacing={1.5}>
      <ViewModeToggle toggleButtonProps={{ sx: { height: '36px', fontSize: '24px' } }} />
      <ShareButton id={instanceId} sx={{ height: '36px', fontSize: '24px' }} />
    </Stack>
  )
}

export default AdditionalButtons
