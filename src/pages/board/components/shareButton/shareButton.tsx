import { Snackbar } from '@mui/material'
import React, { useState } from 'react'
import ShareIcon from '@mui/icons-material/Share'
import TooltipButton from '../../../../shared/components/tooltipButton/tooltipButton'

type Props = {
  id: string
}

const ShareButton = ({ id }: Props) => {
  const [open, setOpen] = useState(false)
  const shareLink = `${window.location.origin}/board/${id}`

  const handleClick = () => {
    setOpen(true)
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <>
      <TooltipButton variant={'outlined'} tipText={'Copy board URL'} onClick={handleClick}>
        <ShareIcon />
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
