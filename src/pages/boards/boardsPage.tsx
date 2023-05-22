import { Stack } from '@mui/material'
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore'
import { SetStateAction, useContext, useEffect, useState } from 'react'
import { FirebaseUserContext, FirebaseUserContextType } from '../../providers/firebaseUserProvider'
import BoardTable, { BoardEntity } from './components/boardTable/boardTable'
import { db } from '../../config/firebase'

const BoardsPage = () => {
  const { user } = useContext(FirebaseUserContext) as FirebaseUserContextType
  const [boards, setBoards] = useState<BoardEntity[]>([])

  useEffect(() => {
    if (user)
      onSnapshot(doc(db, 'users', user?.id), (doc) => {
        const userData = doc.data()

        if (userData && userData.userBoards.length) {
          const q = query(collection(db, 'boards'), where('boardId', 'in', userData.userBoards))
          getDocs(q).then((data) => {
            const newBoards: SetStateAction<BoardEntity[]> = []

            data.forEach((doc) => {
              const board = doc.data()
              newBoards.push(board as BoardEntity)
            })
            setBoards(newBoards)
          })
        }
      })
  }, [])

  return (
    <Stack alignItems={'center'} justifyContent={'center'} height={'inherit'}>
      {user && <BoardTable user={user} boards={boards} onUpdate={console.log} />}
    </Stack>
  )
}

export default BoardsPage
