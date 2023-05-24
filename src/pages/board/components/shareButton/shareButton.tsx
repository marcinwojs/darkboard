import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'
import ShareIcon from '@mui/icons-material/Share'

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

export default ShareButton
