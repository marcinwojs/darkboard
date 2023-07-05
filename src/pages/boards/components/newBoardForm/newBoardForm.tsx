import {
  Button,
  ButtonProps,
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
  Typography,
} from '@mui/material'
import { FormEvent, useState, useEffect } from 'react'
import useCreateBoard, { NewBoardProps } from '../../../../hooks/useCreateBoard'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import { BoardsTemplatesKeys, boardTemplates } from '../../../../templates/templates'
import { useUserContext } from '../../../../providers/firebaseUserProvider'
import { handleError } from '../../../../config/errorsMessages'
import { LoadingButton } from '@mui/lab'

type Props = {
  size?: ButtonProps['size']
  onSuccess?: () => void
}

const initialFormState: NewBoardProps = {
  boardName: '',
  description: '',
  template: BoardsTemplatesKeys.blank,
}

const NewBoardForm = ({ size, onSuccess }: Props) => {
  const { user } = useUserContext()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<NewBoardProps>(initialFormState)
  const [loading, setLoading] = useState(false)
  const { createBoard } = useCreateBoard()
  const boardTemplateList = Object.values(BoardsTemplatesKeys)

  useEffect(() => {
    setError('')
  }, [formState])

  const handleClickOpen = () => {
    if (!user) {
      return navigate('/login')
    }

    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!loading) {
      setLoading(true)

      try {
        const boardId = await createBoard(formState)

        onSuccess && onSuccess()
        navigate(`/board/${boardId}`)
        setLoading(false)
      } catch (e) {
        const error = e as Error
        setError(handleError(error.name, error))
        setLoading(false)
      }
    }
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
            {error ? (
              <Typography color={'red'} mr={'auto'} px={2}>
                {error}
              </Typography>
            ) : null}
            <Button variant={'contained'} onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton loading={loading} variant={'contained'} type={'submit'} autoFocus>
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default NewBoardForm
