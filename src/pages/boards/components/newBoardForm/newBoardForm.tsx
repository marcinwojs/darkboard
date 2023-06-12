import {
  Button,
  ButtonProps,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material'
import { FormEvent, useState } from 'react'
import useCreateBoard from '../../../../hooks/useCreateBoard'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import { boardTemplates } from '../../../../templates/templates'

type Props = {
  size?: ButtonProps['size']
  onSuccess?: () => void
}

const initialFormState = {
  boardName: '',
  description: '',
  privateBoard: false,
  template: 'blank',
}

const NewBoardForm = ({ size, onSuccess }: Props) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState(initialFormState)
  const { createBoard } = useCreateBoard()
  const boardTemplateList = Object.values(boardTemplates)
  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const onCreateBoard = () => {
    createBoard(formState).then((id) => {
      onSuccess && onSuccess()
      navigate(`/board/${id}`)
    })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onCreateBoard()
  }

  return (
    <div>
      <Button size={size} variant='contained' onClick={handleClickOpen} startIcon={<AddIcon />}>
        Create Board
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <form onSubmit={onSubmit}>
          <DialogTitle id='alert-dialog-title'>New Board Form</DialogTitle>
          <DialogContent>
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

              <FormControl>
                <FormLabel>Board Templates</FormLabel>
                <RadioGroup
                  defaultValue='blank'
                  onChange={(event) => setFormState({ ...formState, template: event.target.value })}
                >
                  <FormControlLabel value='blank' control={<Radio />} label='Blank' />
                  {boardTemplateList.map(({ name }) => {
                    return (
                      <FormControlLabel key={name} value={name} control={<Radio />} label={name} />
                    )
                  })}
                </RadioGroup>
              </FormControl>
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
