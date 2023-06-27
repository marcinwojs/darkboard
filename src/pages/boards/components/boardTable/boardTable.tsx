import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AvatarGroup from '../../../../shared/components/avatar/avatarGroup'
import NewBoardForm from '../newBoardForm/newBoardForm'
import moment from 'moment'
import { convertToObjectDate } from '../../../../shared/utils'
import { styled } from '@mui/material/styles'
import { UserEntity } from '../../../../providers/firebaseUserProvider'
import BoardInfoTooltipBtn from './boardInfoTooltipBtn'
import ControlButtonsGroup from './controlButtonsGroup'
import { AccessRequestEntity } from '../../../../hooks/useBoardRoom'

const CenteredCell = styled(TableCell)(() => ({
  textAlign: 'center',
}))

type UserBoardEntity = {
  name: string
  id: string
}

export type BoardEntity = {
  boardId: string
  boardName: string
  requests: AccessRequestEntity[]
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
  return (
    <Paper>
      <TableContainer
        sx={{
          minHeight: '350px',
          boxShadow: 'none',
          mb: 1,
        }}
      >
        <Table size={'small'}>
          <TableHead>
            <TableRow>
              <CenteredCell>Name</CenteredCell>
              <CenteredCell></CenteredCell>
              <CenteredCell>Users</CenteredCell>
              <CenteredCell></CenteredCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boards.map((board) => (
              <TableRow
                key={board.boardId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <CenteredCell>
                  <Stack direction={'row'}>
                    <Typography pl={1.4}>{board.boardName}</Typography>
                  </Stack>
                </CenteredCell>
                <CenteredCell padding={'none'}>
                  <BoardInfoTooltipBtn
                    description={board.description}
                    lastEdit={moment(convertToObjectDate(board.lastEdit)).fromNow()}
                  />
                </CenteredCell>
                <CenteredCell>
                  <AvatarGroup users={board.users} creatorId={board.creatorId} />
                </CenteredCell>
                <CenteredCell padding={'none'}>
                  <ControlButtonsGroup board={board} userId={user.id} />
                </CenteredCell>
              </TableRow>
            ))}
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
