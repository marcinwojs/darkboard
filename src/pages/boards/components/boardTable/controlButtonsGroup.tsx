import { Snackbar, Stack } from '@mui/material'
import TooltipButton from '../../../../shared/components/tooltipButton/tooltipButton'
import ShareButton from '../../../board/components/shareButton/shareButton'
import { DeleteForever, Logout, Login } from '@mui/icons-material'
import useRemoveBoard from '../../../../hooks/useRemoveBoard'
import useBoardRoom from '../../../../hooks/useBoardRoom'
import useConfirm from '../../../../shared/hooks/useConfirm'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { handleError } from '../../../../config/errorsMessages'
import { BoardEntity } from './boardTable'
import RequestsDialog from '../../../board/components/requestsDialog/requestsDialog'

type Props = {
  board: BoardEntity
  userId: string
}

const ControlButtonsGroup = ({ userId, board }: Props) => {
  const { boardId, creatorId } = board
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const confirmRemove = useConfirm({
    title: 'Delete board',
    body: 'Are you sure you want to delete this board? This action will permanently remove the board you created and remove it from all participants lists.',
    buttons: {
      confirm: 'Confirm',
      reject: 'Cancel',
    },
  })
  const confirmLeave = useConfirm({
    title: 'Remove from board',
    body: 'Are you sure you want to remove yourself from this board? This action will remove you as a participant from the board, and you will no longer have access to it.',
    buttons: {
      confirm: 'Confirm',
      reject: 'Cancel',
    },
  })
  const { removeBoard } = useRemoveBoard()
  const { leaveRoom } = useBoardRoom()

  const navigateToBoard = (id: string) => {
    navigate(`/board/${id}`, { replace: true })
  }

  const onRemoveBoard = async (id: string) => {
    const confirm = await confirmRemove()

    if (userId && confirm) {
      removeBoard(userId, id).catch((error) => {
        setError(handleError(error.code, error))
      })
    }
  }

  const onLeaveBoard = async (id: string) => {
    const confirm = await confirmLeave()

    if (userId && confirm) {
      leaveRoom(id, userId).catch((error) => {
        setError(handleError(error.code, error))
      })
    }
  }

  return (
    <>
      <Stack direction={'row'}>
        <TooltipButton tipText={'Go to board'} onClick={() => navigateToBoard(boardId)}>
          <Login fontSize={'small'} />
        </TooltipButton>
        <ShareButton size={'small'} id={boardId} />
        {creatorId === userId ? (
          <>
            <RequestsDialog board={board} />
            <TooltipButton tipText={'Delete Board'} onClick={() => onRemoveBoard(boardId)}>
              <DeleteForever fontSize={'small'} />
            </TooltipButton>
          </>
        ) : (
          <TooltipButton tipText={'Remove me from Board'} onClick={() => onLeaveBoard(boardId)}>
            <Logout fontSize={'small'} />
          </TooltipButton>
        )}
      </Stack>
      <Snackbar
        open={Boolean(error)}
        onClose={() => setError('')}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        message={error}
      />
    </>
  )
}

export default ControlButtonsGroup
