import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'
import DynamicHeader from './header/dynamicHeader'
import { useAppLayoutContext } from '../providers/appLayoutProvider'

type Props = {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  const { headerMode } = useAppLayoutContext()

  return (
    <Box>
      <DynamicHeader />
      <Container
        maxWidth={false}
        sx={{ height: headerMode === 'regular' ? 'calc(100vh - 70px)' : '100vh' }}
        disableGutters
      >
        {children}
      </Container>
    </Box>
  )
}

export default LayoutWrapper
