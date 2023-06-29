import { Button, ClickAwayListener, Stack, TextField } from '@mui/material'
import { FormEvent, useRef, useState } from 'react'
import { Check, Clear } from '@mui/icons-material'
import { setWithTransition } from '../../../shared/helpers/helpers'
import { useUserContext } from '../../../providers/firebaseUserProvider'
import useFirestoreUser from '../../../hooks/useFirestoreUser'

const ProfileUsernameInput = () => {
  const ref = useRef<HTMLButtonElement>(null)
  const { user } = useUserContext()
  const [activeEdit, setActiveEdit] = useState(false)
  const [newUsername, setNewUsername] = useState(user?.firstName)
  const { updateUserData } = useFirestoreUser()

  const cancelNameChange = () => {
    setNewUsername(user?.firstName)
    setWithTransition(() => setActiveEdit(false))
  }

  const onClickOutside = () => {
    if (ref.current) {
      ref.current.click()
    }
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (user && user.firstName !== newUsername) {
      try {
        const update = updateUserData(user?.id, { firstName: newUsername })
      } catch (e) {
        console.log('error')
      }
    }
    setWithTransition(() => setActiveEdit(false))
  }

  return (
    <ClickAwayListener onClickAway={onClickOutside}>
      <form autoComplete={'off'} onSubmit={onSubmit} style={{ position: 'relative' }}>
        <TextField
          label='Username'
          focused={activeEdit}
          size={'small'}
          value={newUsername}
          onChange={(event) => setNewUsername(event.currentTarget.value)}
          onClick={() => setWithTransition(() => setActiveEdit(true))}
          required
        />
        {activeEdit ? (
          <Stack flexDirection={'row'} sx={{ position: 'absolute', right: 0, m: 0.5 }}>
            <Button
              type={'submit'}
              ref={ref}
              variant={'contained'}
              size={'small'}
              sx={{ p: 0, minWidth: 0, mr: 1 }}
            >
              <Check />
            </Button>
            <Button
              onClick={cancelNameChange}
              variant={'contained'}
              size={'small'}
              sx={{ p: 0, minWidth: 0 }}
            >
              <Clear />
            </Button>
          </Stack>
        ) : null}
      </form>
    </ClickAwayListener>
  )
}

export default ProfileUsernameInput
