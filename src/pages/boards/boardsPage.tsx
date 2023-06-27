import { Grid } from '@mui/material'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useUserContext } from '../../providers/firebaseUserProvider'
import BoardTable, { BoardEntity } from './components/boardTable/boardTable'
import { db } from '../../config/firebase'
import NewBoardForm from './components/newBoardForm/newBoardForm'

const BoardsPage = () => {
  const { user } = useUserContext()

  const [boards, setBoards] = useState<BoardEntity[]>([])

  useEffect(() => {
    const userSearch = {
      id: user?.id || '',
      name: user?.firstName || '',
    }

    if (user) {
      const q = query(collection(db, 'boards'), where('users', 'array-contains', userSearch))
      onSnapshot(q, (querySnapshot) => {
        const myBoards: BoardEntity[] = []

        querySnapshot.forEach((doc) => {
          myBoards.push(doc.data() as BoardEntity)
        })
        setBoards(myBoards)
      })
    }
  }, [user])

  return (
    <Grid container justifyContent={'center'} pt={10}>
      <Grid item xs={10} md={8} display='flex' justifyContent={'center'}>
        {boards.length && user ? (
          <BoardTable user={user} boards={boards} />
        ) : (
          <NewBoardForm size={'large'} />
        )}
      </Grid>
    </Grid>
  )
}

export default BoardsPage
