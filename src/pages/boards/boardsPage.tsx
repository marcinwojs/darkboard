import { Grid } from '@mui/material'
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore'
import { SetStateAction, useEffect, useState } from 'react'
import { useUserContext } from '../../providers/firebaseUserProvider'
import BoardTable, { BoardEntity } from './components/boardTable/boardTable'
import { db } from '../../config/firebase'
import NewBoardForm from './components/newBoardForm/newBoardForm'

const BoardsPage = () => {
  const { user } = useUserContext()

  const [boards, setBoards] = useState<BoardEntity[]>([])

  useEffect(() => {
    if (user)
      onSnapshot(doc(db, 'users', user?.id), (doc) => {
        const userData = doc.data()

        if (!userData) return

        if (userData.userBoards.length) {
          const q = query(collection(db, 'boards'), where('boardId', 'in', userData.userBoards))
          getDocs(q).then((data) => {
            const newBoards: SetStateAction<BoardEntity[]> = []

            data.forEach((doc) => newBoards.push(doc.data() as BoardEntity))
            setBoards(newBoards)
          })
        } else {
          setBoards([])
        }
      })
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
