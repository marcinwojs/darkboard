import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useUserContext } from '../../providers/firebaseUserProvider'

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { user } = useUserContext()

  if (!user) {
    return <Navigate to={'/login'} />
  }
  return children
}

export default ProtectedRoutes
