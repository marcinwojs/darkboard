import { IconButtonProps, Snackbar } from '@mui/material'
import React, { useState } from 'react'
import ShareIcon from '@mui/icons-material/Share'
import TooltipButton from '../../../../shared/components/tooltipButton/tooltipButton'

type Props = IconButtonProps & {
  id: string
  mobile?: boolean
}

const ShareButton = ({ id, mobile = false, ...buttonProps }: Props) => {
  const [open, setOpen] = useState(false)
  const shareLink = `${window.location.origin}/board/${id}`

  const handleClick = () => {
    setOpen(true)
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <>
      <TooltipButton
        mobile={mobile}
        tipText={'Copy board URL'}
        {...buttonProps}
        onClick={handleClick}
      >
        <ShareIcon fontSize={'inherit'} />
      </TooltipButton>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        message='Copied invite board link to clipboard'
      />
    </>
  )
}

export default React.memo(ShareButton)
