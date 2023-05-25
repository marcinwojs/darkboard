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
import { DeleteForever } from '@mui/icons-material'
import ShareButton from '../../../board/components/shareButton/shareButton'
import AvatarGroup from '../../../../shared/components/avatar/avatarGroup'
import NewBoardForm from '../newBoardForm/newBoardForm'
import { CheckCircle, Unpublished } from '@mui/icons-material/'
import moment from 'moment'
import { convertToObjectDate } from '../../../../shared/utils'
import { styled } from '@mui/material/styles'
import { UserEntity } from '../../../../providers/firebaseUserProvider'

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
  onUpdate: () => void
}

const BoardTable = ({ boards, user, onUpdate }: Props) => {
  const navigate = useNavigate()
  const { removeBoard } = useRemoveBoard()

  const navigateToBoard = (id: string) => {
    navigate(`/board/${id}`, { replace: true })
  }

  const onRemoveBoard = (id: string) => {
    if (user) removeBoard(user?.id, id).then(() => onUpdate())
  }

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'end' }}>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: '1200px', minHeight: '400px', boxShadow: 'none', mb: 1 }}
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
                    ) : null}
                  </CenteredCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box alignSelf={'end'} p={1}>
        <NewBoardForm onSuccess={onUpdate} />
      </Box>
    </Paper>
  )
}

export default BoardTable
