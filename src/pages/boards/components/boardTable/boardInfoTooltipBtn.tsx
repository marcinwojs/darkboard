import { ClickAwayListener, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'

type Props = {
  description: string
  lastEdit: string
}
const BoardInfoTooltipBtn = ({ lastEdit, description }: Props) => {
  const [open, setOpen] = useState(false)

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          onOpen={handleTooltipOpen}
          open={open}
          title={
            <Stack textAlign={'start'}>
              <Typography>Description:</Typography>
              <Typography variant={'subtitle2'} mb={1}>
                {description}
              </Typography>
              <Typography>Last Edit:</Typography>
              <Typography variant={'subtitle2'}>{lastEdit}</Typography>
            </Stack>
          }
        >
          <IconButton onClick={handleTooltipOpen}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </div>
    </ClickAwayListener>
  )
}

export default BoardInfoTooltipBtn
