import React from 'react'
import { confirmable, createConfirmation, ReactConfirmProps } from 'react-confirm'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type Buttons = {
  confirm: string
  reject: string
}

export type UseConfirmProps = {
  title: string
  body: string
  buttons: Buttons
}

interface Confirmable<Value> extends Omit<ReactConfirmProps, 'proceed'> {
  proceed: (value?: Value) => void
}

const UseConfirm = ({ title, body, buttons }: UseConfirmProps) => {
  return () => {
    return createConfirmation(
      confirmable<Confirmable<boolean>>(({ show, proceed }) => {
        return (
          <Dialog open={show} onClose={() => proceed(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{body}</DialogContent>
            <DialogActions>
              <Button onClick={() => proceed(false)}>{buttons.reject}</Button>
              <Button onClick={() => proceed(true)}>{buttons.confirm}</Button>
            </DialogActions>
          </Dialog>
        )
      }),
    )({}) as unknown as Promise<boolean>
  }
}

export default UseConfirm
