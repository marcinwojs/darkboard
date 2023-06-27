import { FormControl, Input, InputAdornment, InputLabel } from '@mui/material'
import TooltipButton from '../../../../shared/components/tooltipButton/tooltipButton'
import { useState } from 'react'

type Props = {
  onSubmit: (email: string) => void
}

const AddUserForm = ({ onSubmit }: Props) => {
  const [formState, setFormState] = useState('')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(formState)
      }}
      style={{ display: 'flex', width: '100%' }}
    >
      <FormControl fullWidth variant='standard'>
        <InputLabel htmlFor='standard-adornment-password'>User Email</InputLabel>
        <Input
          id='standard-adornment-password'
          size={'small'}
          required
          onKeyDown={(ev) => ev.stopPropagation()}
          onChange={(ev) => setFormState(ev.target.value)}
          type={'email'}
          endAdornment={
            <InputAdornment position='end'>
              <TooltipButton type={'submit'} tipText={'add new user'}>
                Add
              </TooltipButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </form>
  )
}

export default AddUserForm
