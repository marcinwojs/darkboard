import { Button, Snackbar, Stack, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import useBoardRoom from '../../../../hooks/useBoardRoom'
import { BoardEntity } from '../../../boards/components/boardTable/boardTable'
import { UserEntity } from '../../../../providers/firebaseUserProvider'
import {
  NotificationData,
  NotificationTypes,
  RequestData,
  RequestTypes,
} from '../../../../shared/types'
import React, { useState } from 'react'
import useNotifications from '../../../../hooks/useNotifications'

type Props = {
  board: BoardEntity
  user: UserEntity
}

const AskAccessView = ({ board, user }: Props) => {
  const { createRequest } = useBoardRoom()
  const { createNotification } = useNotifications()
  const [response, setResponse] = useState('')

  const handleAskAccess = () => {
    const accessRequest: RequestData = {
      type: RequestTypes.access,
      metaData: {
        userId: user.id,
        userName: user.firstName
      },
    }

    const notificationData: NotificationData = {
      type: NotificationTypes.request,
      message: `User ${user.firstName} (${user.email}) ask for access to board (${board.boardName})`,
    }

    createRequest(board.boardId, accessRequest)
      .then(() => {
        return createNotification(board.creatorId, notificationData).then(() =>
          setResponse('The owner of the board got a request for access'),
        )
      })
      .catch(() => {
        setResponse('we could not send a request for access')
      })
  }

  return (
    <Stack m={10} spacing={2}>
      <Typography textAlign={'center'}>Ask request for board access</Typography>
      <Button startIcon={<Add />} onClick={handleAskAccess}>
        Ask for Access to board
      </Button>
      <Snackbar
        open={Boolean(response)}
        onClose={() => setResponse('')}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        message={response}
      />
    </Stack>
  )
}

export default AskAccessView
