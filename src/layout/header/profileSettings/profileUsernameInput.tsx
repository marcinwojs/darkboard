import { Button, ClickAwayListener, Snackbar, Stack, TextField } from '@mui/material'
import React, { FormEvent, useRef, useState } from 'react'
import { Check, Clear } from '@mui/icons-material'
import { setWithTransition } from '../../../shared/helpers/helpers'
import { useUserContext } from '../../../providers/firebaseUserProvider'
import useFirestoreUser from '../../../hooks/useFirestoreUser'
import { handleError } from '../../../config/errorsMessages'

const ProfileUsernameInput = () => {
  const ref = useRef<HTMLButtonElement>(null)
  const { user } = useUserContext()
  const [activeEdit, setActiveEdit] = useState(false)
  const [newUsername, setNewUsername] = useState(user?.firstName)
  const [error, setError] = useState('')
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
    setActiveEdit(false)

    event.preventDefault()
    if (user && user.firstName !== newUsername) {
      try {
        await updateUserData(user?.id, { firstName: newUsername })
      } catch (e) {
        const error: Error = e as Error
        setError(handleError(error.message))
      }
    }
  }

  return (
    <>
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
      <Snackbar
        open={Boolean(error)}
        onClose={() => setError('')}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        message='error'
      />
    </>
  )
}

export default ProfileUsernameInput
