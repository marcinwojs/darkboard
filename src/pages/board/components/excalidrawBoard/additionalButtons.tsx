import ViewModeToggle from '../viewModeToggle/viewModeToggle'
import ShareButton from '../shareButton/shareButton'
import { Stack } from '@mui/material'
import { useDevice } from '@excalidraw/excalidraw'
import InjectBefore from '../../../../shared/helpers/injectBefore'

type Props = {
  instanceId: string
}

const AdditionalButtons = ({ instanceId }: Props) => {
  const { isMobile } = useDevice()
  const toInject = document.querySelector('.mobile-misc-tools-container')

  if (isMobile && toInject) {
    return (
      <>
        {InjectBefore(
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
            <ShareButton
              id={instanceId}
              sx={{ minWidth: '36px', px: 0, fontSize: '16px' }}
            />
          </Stack>,
          toInject,
        )}
      </>
    )
  }

  return (
    <Stack direction={'row'} spacing={1.5}>
      <ViewModeToggle toggleButtonProps={{ sx: { height: '36px', fontSize: '24px' } }} />
      <ShareButton id={instanceId} sx={{ height: '36px', fontSize: '24px' }} />
    </Stack>
  )
}

export default AdditionalButtons
