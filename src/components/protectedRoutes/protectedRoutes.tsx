import { useNavigate } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'
import LoadingPage from '../../shared/components/loadingPage/loadingPage'
import { useUserContext } from '../../providers/firebaseUserProvider'

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { user, loaded } = useUserContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (loaded && !user) {
      navigate('/login')
    }
  }, [loaded, user])

  return loaded && user ? children : <LoadingPage />
}

export default ProtectedRoutes
