import { Button, Divider, Stack, Typography, useTheme } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Fragment, useContext, useEffect, useState } from 'react'
import LoginIcon from '@mui/icons-material/Login'
import { useNavigate } from 'react-router-dom'
import useRemoveBoard from '../../hooks/useRemoveBoard'
import { DeleteForever } from '@mui/icons-material'
import useFirestoreUser, { UserBoardEntity } from '../../hooks/useFirestoreUser'
import { FirebaseUserContext, FirebaseUserContextType } from '../../providers/firebaseUserProvider'
import NewBoardForm from './components/newBoardForm/newBoardForm'
import ShareButton from '../board/components/shareDialog/shareButton'

const Boards = () => {
  const { user } = useContext(FirebaseUserContext) as FirebaseUserContextType
  const navigate = useNavigate()
  const theme = useTheme()
  const { getUserData } = useFirestoreUser()
  const [boardsCollection, setBoardCollection] = useState<UserBoardEntity[]>([])
  const { removeBoard } = useRemoveBoard()

  const updateBoardList = () => {
    getUserData(user?.id || '').then(({ userBoards }) => {
      setBoardCollection(userBoards)
    })
  }

  useEffect(() => {
    if (user?.id) {
      updateBoardList()
    }
  }, [user])

  const navigateToBoard = (id: string) => {
    navigate(`/board/${id}`, { replace: true })
  }

  const onRemoveBoard = (id: string) => {
    if (user) removeBoard(user?.id, id).then(() => updateBoardList())
  }

  const groupedBoards = boardsCollection.reduce(
    (acc, curr) => {
      const key = curr.own ? 'own' : 'membership'
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(curr)
      return acc
    },
    { own: [], membership: [] } as { own: UserBoardEntity[]; membership: UserBoardEntity[] },
  )

  return (
    <Stack>
      <Stack my={5} alignItems='center'>
        <List sx={{ bgcolor: theme.palette.grey['A200'], my: 10, borderRadius: 2, width: '400px' }}>
          <Typography textAlign={'center'} variant={'h5'}>
            You Boards List:
          </Typography>
          <Divider />
          {groupedBoards.own.map(({ name, id, own }) => {
            return own ? (
              <Fragment key={id}>
                <ListItem>
                  <ListItemText primary={name} />
                  <ShareButton id={id} />
                  <Button onClick={() => navigateToBoard(id)}>
                    <LoginIcon />
                  </Button>
                  <Button onClick={() => onRemoveBoard(id)}>
                    <DeleteForever />
                  </Button>
                </ListItem>
                <Divider />
              </Fragment>
            ) : null
          })}
        </List>
        <NewBoardForm onSuccess={updateBoardList} />
      </Stack>
      <Stack my={5} alignItems='center'>
        <List sx={{ bgcolor: theme.palette.grey['A200'], my: 10, borderRadius: 2, width: '400px' }}>
          <Typography textAlign={'center'} variant={'h5'}>
            Membership Boards List:
          </Typography>
          <Divider />
          {groupedBoards.membership.map(({ name, id, own }) => {
            return !own ? (
              <Fragment key={id}>
                <ListItem>
                  <ListItemText primary={name} />
                  <Button onClick={() => navigateToBoard(id)}>
                    <LoginIcon />
                  </Button>
                </ListItem>
                <Divider />
              </Fragment>
            ) : null
          })}
        </List>
      </Stack>
    </Stack>
  )
}

export default Boards
