import { useRoutes } from 'react-router-dom'
import Page404 from './pages/page404'
import RegisterPage from './pages/register/registerPage'
import LoginPage from './pages/login/loginPage'
import HomePage from './pages/home/homePage'

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <HomePage />,
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
  ])

  return routes
}
