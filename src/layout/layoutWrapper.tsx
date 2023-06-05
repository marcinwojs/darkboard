import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'
import DynamicHeader from './header/dynamicHeader'

type Props = {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  return (
    <Box>
      <DynamicHeader />
      <Container maxWidth={false} sx={{ height: 'inherit' }} disableGutters>
        {children}
      </Container>
    </Box>
  )
}

export default LayoutWrapper
