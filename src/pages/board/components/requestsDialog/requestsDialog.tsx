import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useRef, useState } from 'react'
import TooltipButton from '../../../../shared/components/tooltipButton/tooltipButton'
import { Close, LocalPostOffice } from '@mui/icons-material'
import useBoardRoom, { AccessRequestEntity } from '../../../../hooks/useBoardRoom'

type Props = {
  mobile?: boolean
  boardId: string
  requests: AccessRequestEntity[]
}

const RequestsDialog = ({ mobile = false, requests, boardId }: Props) => {
  const [open, setOpen] = useState(false)
  const { acceptAccessRequest, removeRequest } = useBoardRoom()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => setOpen(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div>
      <TooltipButton
        mobile={mobile}
        size={'small'}
        tipText={'Board requests'}
        onClick={handleClickOpen}
      >
        <Badge
          badgeContent={requests.length}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          color='primary'
          variant={'dot'}
        >
          <LocalPostOffice fontSize={'inherit'} />
        </Badge>
      </TooltipButton>
      <Dialog ref={ref} open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          Board Requests
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={1} minHeight={'200px'} maxHeight={'500px'} overflow={'auto'}>
            {requests.length ? (
              requests.map((request) => {
                return (
                  <Grid key={request.id} item xs={12}>
                    <Stack
                      p={1}
                      component={Paper}
                      flexDirection={'row'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Typography>
                        User {request.metaData.userName} ask for access to board
                      </Typography>
                      <Box px={3}>
                        <Button
                          onClick={() => acceptAccessRequest(boardId, request.id, request.metaData)}
                          sx={{ mr: 4 }}
                          size={'small'}
                          color={'success'}
                          variant={'contained'}
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => removeRequest(boardId, request.id)}
                          size={'small'}
                          color={'error'}
                          variant={'contained'}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Stack>
                  </Grid>
                )
              })
            ) : (
              <Grid item xs={12}>
                <Typography fontSize={'larger'} textAlign={'center'}>
                  No Requests
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RequestsDialog
