import { useRoutes } from 'react-router-dom'
import Page404 from './pages/page404'
import RegisterPage from './pages/register/registerPage'
import LoginPage from './pages/login/loginPage'
import HomePage from './pages/home/homePage'
import Board from './pages/board/board'
import BoardsPage from './pages/boards/boardsPage'
import WebsocketProvider from './providers/websocketProvider'
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
      path: '*',
      element: <Page404 />,
    },
    {
      path: '/users',
      element: (
        <ProtectedRoutes>
          <HomePage />
        </ProtectedRoutes>
      ),
    },
    {
      path: '/board/:boardId',
      element: (
        <ProtectedRoutes>
          <WebsocketProvider>
            <Board />
          </WebsocketProvider>
        </ProtectedRoutes>
      ),
    },
    {
      path: '/boards',
      element: (
        <ProtectedRoutes>
          <BoardsPage />
        </ProtectedRoutes>
      ),
    },
  ])

  return routes
}
