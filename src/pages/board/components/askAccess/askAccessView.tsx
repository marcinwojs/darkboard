import { Button, Snackbar, Stack, Typography } from '@mui/material'
import { Add, Lock } from '@mui/icons-material'
import useBoardRoom, { AccessRequestData, RequestTypes } from '../../../../hooks/useBoardRoom'
import { BoardEntity } from '../../../boards/components/boardTable/boardTable'
import { UserEntity } from '../../../../providers/firebaseUserProvider'

import React, { useState } from 'react'

type Props = {
  board: BoardEntity
  user: UserEntity
}

// TODO change whole component
const AskAccessView = ({ board, user }: Props) => {
  const { createAccessRequest } = useBoardRoom()
  const [response, setResponse] = useState('')

  const handleAskAccess = async () => {
    const accessRequest: AccessRequestData = {
      type: RequestTypes.access,
      metaData: {
        userId: user.id,
        userName: user.firstName,
      },
    }

    try {
      const response = await createAccessRequest(board, user, accessRequest)
      setResponse(response)
    } catch (error) {
      if (error instanceof Error) {
        setResponse(error.message)
      }
      setResponse('Unexpected Error')
    }
  }

  return (
    <Stack mt={15} spacing={2} justifyContent={'center'} alignItems={'center'}>
      <Lock sx={{ fontSize: '160px' }} />
      <Typography variant={'h4'} textAlign={'center'}>
        You do not have access to this board.
      </Typography>
      <Button size={'large'} startIcon={<Add />} onClick={handleAskAccess}>
        Ask for access
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
