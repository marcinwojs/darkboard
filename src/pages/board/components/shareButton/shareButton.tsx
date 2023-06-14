import { IconButtonProps, Snackbar } from '@mui/material'
import React, { useState } from 'react'
import ShareIcon from '@mui/icons-material/Share'
import TooltipButton from '../../../../shared/components/tooltipButton/tooltipButton'

type Props = IconButtonProps & {
  id: string
}

const ShareButton = ({ id, ...buttonProps }: Props) => {
  const [open, setOpen] = useState(false)
  const shareLink = `${window.location.origin}/board/${id}`

  const handleClick = () => {
    setOpen(true)
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <>
      <TooltipButton tipText={'Copy board URL'} {...buttonProps} onClick={handleClick}>
        <ShareIcon fontSize={'inherit'} />
      </TooltipButton>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message='Copied invite board link to clipboard'
      />
    </>
  )
}

export default React.memo(ShareButton)
