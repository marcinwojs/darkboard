import { useRoutes } from 'react-router-dom'
import Page404 from './pages/page404'
import RegisterPage from './pages/register/registerPage'
import LoginPage from './pages/login/loginPage'
import Board from './pages/board/board'
import BoardsPage from './pages/boards/boardsPage'
import LandingPage from './pages/landing/landingPage'
import ProtectedRoutes from './components/protectedRoutes/protectedRoutes'

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/boards',
      element: <BoardsPage />,
    },
    {
      path: '/board/:boardId',
      element: (
        <ProtectedRoutes>
          <Board />
        </ProtectedRoutes>
      ),
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ])

  return routes
}
