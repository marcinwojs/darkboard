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
  Tooltip,
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
import { RequestEntity } from '../../../../shared/types'

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
  requests: RequestEntity[]
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
            {boards.map(({ boardId, boardName, creatorId, lastEdit, description, users }) => (
              <TableRow key={boardId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <CenteredCell>
                  <Stack direction={'row'}>
                    <Typography pl={1.4}>{boardName}</Typography>
                  </Stack>
                </CenteredCell>
                <CenteredCell padding={'none'}>
                  <BoardInfoTooltipBtn
                    description={description}
                    lastEdit={moment(convertToObjectDate(lastEdit)).fromNow()}
                  />
                </CenteredCell>
                <CenteredCell>
                  <AvatarGroup users={users} creatorId={creatorId} />
                </CenteredCell>
                <CenteredCell padding={'none'}>
                  <ControlButtonsGroup boardId={boardId} creatorId={creatorId} userId={user.id} />
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
