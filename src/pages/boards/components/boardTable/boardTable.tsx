import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useRemoveBoard from '../../../../hooks/useRemoveBoard'
import LoginIcon from '@mui/icons-material/Login'
import { DeleteForever, Logout } from '@mui/icons-material'
import ShareButton from '../../../board/components/shareButton/shareButton'
import AvatarGroup from '../../../../shared/components/avatar/avatarGroup'
import NewBoardForm from '../newBoardForm/newBoardForm'
import { CheckCircle, Unpublished } from '@mui/icons-material/'
import moment from 'moment'
import { convertToObjectDate } from '../../../../shared/utils'
import { styled } from '@mui/material/styles'
import { UserEntity } from '../../../../providers/firebaseUserProvider'
import useConfirm from '../../../../shared/hooks/useConfirm'
import useBoardRoom from '../../../../hooks/useBoardRoom'

const CenteredCell = styled(TableCell)(() => ({
  textAlign: 'center',
}))

type UserBoardEntity = {
  name: string
  creator: boolean
  id: string
}

export type BoardEntity = {
  boardId: string
  boardName: string
  privateBoard: boolean
  description: string
  creatorId: string
  lastEdit: { seconds: number; nanoseconds: number }
  users: UserBoardEntity[]
}

type Props = {
  user: UserEntity
  boards: BoardEntity[]
}

const BoardTable = ({ boards, user }: Props) => {
  const navigate = useNavigate()
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

    if (user && confirm) removeBoard(user?.id, id)
  }
  const onLeaveBoard = async (id: string) => {
    const confirm = await confirmLeave()

    if (user && confirm) leaveRoom(id, user.id)
  }

  return (
    <Paper>
      <TableContainer
        sx={{
          maxWidth: '90vw',
          minWidth: '50vw',
          minHeight: '400px',
          boxShadow: 'none',
          mb: 1,
        }}
      >
        <Table size={'small'}>
          <TableHead>
            <TableRow>
              <CenteredCell>Name</CenteredCell>
              <CenteredCell>Description</CenteredCell>
              <CenteredCell>Private</CenteredCell>
              <CenteredCell>Last Edit</CenteredCell>
              <CenteredCell>Users</CenteredCell>
              <CenteredCell>Ownership</CenteredCell>
              <CenteredCell></CenteredCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boards.map(
              ({ boardId, boardName, creatorId, lastEdit, description, users, privateBoard }) => (
                <TableRow key={boardId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <CenteredCell>{boardName}</CenteredCell>
                  <CenteredCell>{description}</CenteredCell>
                  <CenteredCell>{privateBoard ? <CheckCircle /> : <Unpublished />}</CenteredCell>
                  <CenteredCell>{moment(convertToObjectDate(lastEdit)).fromNow()}</CenteredCell>
                  <CenteredCell>
                    <AvatarGroup users={users} />
                  </CenteredCell>
                  <CenteredCell>
                    {creatorId === user.id ? <Chip label='My Board' color='primary' /> : null}
                  </CenteredCell>
                  <CenteredCell>
                    <Button onClick={() => navigateToBoard(boardId)}>
                      <LoginIcon />
                    </Button>
                    <ShareButton id={boardId} />
                    {creatorId === user.id ? (
                      <Button onClick={() => onRemoveBoard(boardId)}>
                        <DeleteForever />
                      </Button>
                    ) : (
                      <Button onClick={() => onLeaveBoard(boardId)}>
                        <Logout />
                      </Button>
                    )}
                  </CenteredCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box justifyContent={'end'} display={'flex'} p={1}>
        <NewBoardForm />
      </Box>
    </Paper>
  )
}

export default BoardTable
