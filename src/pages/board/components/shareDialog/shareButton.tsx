import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'
import ShareIcon from '@mui/icons-material/Share'

const ShareDialog = () => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
    navigator.clipboard.writeText(window.location.href.toString())
  }

  return (
    <>
      <Button onClick={handleClick}>
        <ShareIcon />
      </Button>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message='Copied invite board link to clipboard'
      />
    </>
  )
}

export default ShareDialog
