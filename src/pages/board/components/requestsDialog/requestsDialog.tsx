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
import { BoardEntity } from '../../../boards/components/boardTable/boardTable'
import { Close, LocalPostOffice } from '@mui/icons-material'
import useFirestore from '../../../../hooks/useFirestore'
import { arrayRemove } from 'firebase/firestore'
import { RequestEntity } from '../../../../shared/types'
import useBoardRoom from '../../../../hooks/useBoardRoom'
import useFirestoreUser from '../../../../hooks/useFirestoreUser'

type Props = {
  mobile?: boolean
  board: BoardEntity
}

const RequestsDialog = ({ mobile = false, board }: Props) => {
  const requests = board.requests
  const [open, setOpen] = useState(false)
  const { updateDocField } = useFirestore()
  const { joinRoom } = useBoardRoom()
  const { getUserData } = useFirestoreUser()
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => setOpen(false)
  const ref = useRef<HTMLDivElement>(null)

  const acceptAccessRequest = async (userId: string, request: RequestEntity) => {
    try {
      await getUserData(userId).then((d) =>
        joinRoom(board, d.id).then(() =>
          removeRequest(request).then(() => {
            console.log('success')
          }),
        ),
      )
    } catch (exceptionVar) {
      console.log('fail')
    }
  }

  const removeRequest = (request: RequestEntity) => {
    return updateDocField({
      id: board.boardId,
      collectionId: 'boards',
      data: { requests: arrayRemove(request) },
    })
  }

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
        <DialogTitle id='alert-dialog-title'>
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
            {requests.map((request) => {
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
                        onClick={() => acceptAccessRequest(request.metaData.userId, request)}
                        sx={{ mr: 4 }}
                        size={'small'}
                        color={'success'}
                        variant={'contained'}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => removeRequest(request)}
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
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RequestsDialog
