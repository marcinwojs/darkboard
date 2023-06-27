import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import TooltipButton from '../../../../shared/components/tooltipButton/tooltipButton'
import { BoardEntity } from '../../../boards/components/boardTable/boardTable'
import useBoardRoom from '../../../../hooks/useBoardRoom'
import { flushSync } from 'react-dom'
import AddUserForm from './addUserForm'
import { Close, PersonAdd } from '@mui/icons-material'
import useFirestoreUser from '../../../../hooks/useFirestoreUser'

type Props = {
  mobile?: boolean
  board: BoardEntity
}

const AddUserToBoard = ({ mobile = false, board }: Props) => {
  const [open, setOpen] = useState(false)
  const [response, setResponse] = useState<boolean | null>(null)
  const { joinRoom } = useBoardRoom()
  const { getUserDataByEmail } = useFirestoreUser()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => setOpen(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleResponse = (responseType: boolean | null) => {
    if ('startViewTransition' in document) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.startViewTransition(() => {
        flushSync(() => {
          setResponse(responseType)
        })
      })
    } else {
      setResponse(responseType)
    }
  }

  const onSubmit = async (email: string) => {
    try {
      await getUserDataByEmail(email).then((d) =>
        joinRoom(board, d.id).then(() => handleResponse(true)),
      )
    } catch (exceptionVar) {
      handleResponse(false)
    }
  }

  return (
    <div>
      <TooltipButton
        mobile={mobile}
        size={'small'}
        tipText={'Add new user'}
        onClick={handleClickOpen}
      >
        <PersonAdd fontSize={'inherit'} />
      </TooltipButton>
      <Dialog ref={ref} open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
          Add new User
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
        <DialogContent sx={{ minHeight: '100px' }}>
          <AddUserForm onSubmit={onSubmit} />
          {response !== null ? (
            <Typography color={response ? 'success' : 'error'} pt={1}>
              {response ? 'Successfully added user' : 'User not found with the specified email'}
            </Typography>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddUserToBoard
