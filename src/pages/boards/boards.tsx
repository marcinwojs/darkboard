import useFirestore from '../../hooks/useFirestore'
import { Button, Divider, Stack, Typography, useTheme } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Fragment, useEffect, useState } from 'react'
import LoginIcon from '@mui/icons-material/Login'
import { useNavigate } from 'react-router-dom'
import useCreateBoard from '../../hooks/useCreateBoard'
import humanId from 'human-id'
import useRemoveBoard from '../../hooks/useRemoveBoard'
import {DeleteForever} from '@mui/icons-material';

type BoardEntityUser = {
  userName: string
  userId: string
  mail: string
}

type BoardEntity = {
  boardName: string
  boardId: string
  creator: string
  users: BoardEntityUser[]
}

const Boards = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { getCollection } = useFirestore()
  const [boardsCollection, setBoardCollection] = useState<BoardEntity[]>([])
  const { createBoard } = useCreateBoard()
  const { removeBoard } = useRemoveBoard()
  const updateBoardList = () => {
    getCollection({ collectionId: 'boards' }).then((data: BoardEntity[]) => {
      setBoardCollection(data)
    })
  }

  useEffect(() => {
    updateBoardList()
  }, [])

  const navigateToBoard = (id: string) => {
    navigate(`/board/${id}`, { replace: true })
  }

  const onCreateBoard = () => {
    createBoard({ boardName: humanId() }).then(() => updateBoardList())
  }

  const onRemoveBoard = (id: string) => {
    removeBoard(id).then(() => updateBoardList())
  }

  return (
    <Stack my={5} alignItems='center'>
      <List sx={{ bgcolor: theme.palette.grey['A200'], my: 10, borderRadius: 2, width: '400px' }}>
        <Typography textAlign={'center'} variant={'h5'}>
          Boards List:
        </Typography>
        <Divider />
        {boardsCollection.map(({ boardName, boardId }) => {
          return (
            <Fragment key={boardId}>
              <ListItem>
                <ListItemText primary={boardName} />
                <Button onClick={() => navigateToBoard(boardId)}>
                  <LoginIcon />
                </Button>
                <Button onClick={() => onRemoveBoard(boardId)}>
                  <DeleteForever />
                </Button>
              </ListItem>
              <Divider />
            </Fragment>
          )
        })}
      </List>
      <Button sx={{ bgcolor: theme.palette.grey['A200'] }} onClick={onCreateBoard}>
        <Typography variant={'h5'}>New Board</Typography>
      </Button>
    </Stack>
  )
}

export default Boards
