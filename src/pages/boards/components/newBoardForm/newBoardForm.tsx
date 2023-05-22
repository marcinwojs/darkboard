import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FormEvent, useState } from 'react'
import useCreateBoard from '../../../../hooks/useCreateBoard'

type Props = {
  onSuccess?: () => void
}

const initialFormState = {
  boardName: '',
  description: '',
  privateBoard: false,
}

const NewBoardForm = ({ onSuccess }: Props) => {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState(initialFormState)
  const { createBoard } = useCreateBoard()

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const onCreateBoard = () => {
    createBoard(formState).then(() => {
      onSuccess && onSuccess()
      setFormState(initialFormState)
      setOpen(false)
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onCreateBoard()
  }

  return (
    <div>
      <Button variant='contained' onClick={handleClickOpen} size={'small'}>
        <Typography>New Board</Typography>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={onSubmit}>
          <DialogTitle id='alert-dialog-title'>New Board Form</DialogTitle>
          <DialogContent sx={{ minWidth: '400px' }}>
            <Stack py={2} spacing={2} justifyContent={'start'}>
              <TextField
                required
                label='Board name'
                value={formState.boardName}
                onChange={(event) => setFormState({ ...formState, boardName: event.target.value })}
              />
              <TextField
                label='Description'
                multiline
                minRows={2}
                value={formState.description}
                onChange={(event) =>
                  setFormState({ ...formState, description: event.target.value })
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formState.privateBoard}
                    sx={{ paddingLeft: 0 }}
                    onChange={(event) =>
                      setFormState({ ...formState, privateBoard: event.target.checked })
                    }
                  />
                }
                label='Private Room'
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant={'contained'} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant={'contained'} type={'submit'} autoFocus>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default NewBoardForm
