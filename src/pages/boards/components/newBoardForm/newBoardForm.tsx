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
  name: '',
}

const NewBoardForm = ({ onSuccess }: Props) => {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState(initialFormState)
  const { createBoard } = useCreateBoard()

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const onCreateBoard = () => {
    createBoard({ boardName: formState.name }).then(() => {
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
      <Button variant='contained' onClick={handleClickOpen}>
        <Typography variant={'h6'}>New Board</Typography>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={onSubmit}>
          <DialogTitle id='alert-dialog-title'>New Board Form</DialogTitle>
          <DialogContent>
            <Stack py={2} spacing={2} justifyContent={'start'}>
              <TextField
                required
                label='Board name'
                value={formState.name}
                onChange={(event) => setFormState({ ...formState, name: event.target.value })}
              />
              <FormControlLabel
                control={<Checkbox sx={{ paddingLeft: 0 }} />}
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
