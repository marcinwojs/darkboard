import { useRoutes } from 'react-router-dom'
import Page404 from './pages/page404'
import RegisterPage from './pages/register/registerPage'
import LoginPage from './pages/login/loginPage'
import HomePage from './pages/home/homePage'
import Board from './pages/board/board'
import Boards from './pages/boards/boards'
import LayoutWrapper from './layout/layoutWrapper'

export default function Router() {
  const routes = useRoutes([
    {
      path: '/users',
      element: (
        <LayoutWrapper>
          <HomePage />
        </LayoutWrapper>
      ),
    },
    {
      path: '/board/:boardId',
      element: (
        <LayoutWrapper>
          <Board />
        </LayoutWrapper>
      ),
    },
    {
      path: '/boards',
      element: (
        <LayoutWrapper>
          <Boards />
        </LayoutWrapper>
      ),
    },
    {
      path: '/',
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
  ])

  return routes
}
