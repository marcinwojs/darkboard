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
    if (user && user.userBoards.length > 0) {
      const q = query(collection(db, 'boards'), where('boardId', 'in', user.userBoards))
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
