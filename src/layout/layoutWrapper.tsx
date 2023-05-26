import { Box, Container } from '@mui/material'
import { ReactNode } from 'react'
import Header from './header'

type Props = {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  return (
    <Box >
      <Header/>
      <Container
        maxWidth={false}
        sx={{ height: 'inherit'}}
        disableGutters
      >
        {children}
      </Container>
    </Box>
  )
}

export default LayoutWrapper
