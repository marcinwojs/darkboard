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
import useCreateBoard, { NewBoardProps } from '../../../../hooks/useCreateBoard'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import { BoardsTemplatesKeys, boardTemplates } from '../../../../templates/templates'

type Props = {
  size?: ButtonProps['size']
  onSuccess?: () => void
}

const initialFormState: NewBoardProps = {
  boardName: '',
  description: '',
  privateBoard: false,
  template: BoardsTemplatesKeys.blank,
}

const NewBoardForm = ({ size, onSuccess }: Props) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<NewBoardProps>(initialFormState)
  const { createBoard } = useCreateBoard()
  const boardTemplateList = Object.values(BoardsTemplatesKeys)
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

  console.log(formState.template)
  console.log(boardTemplates[`${formState.template}`])
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
                  defaultValue={BoardsTemplatesKeys.blank}
                  onChange={(event) =>
                    setFormState({
                      ...formState,
                      template: event.target.value as BoardsTemplatesKeys,
                    })
                  }
                >
                  {boardTemplateList.map((templateKey) => {
                    return (
                      <FormControlLabel
                        key={templateKey}
                        value={templateKey}
                        control={<Radio />}
                        label={boardTemplates[templateKey].name}
                      />
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
