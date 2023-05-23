import { LinearProgress, Stack, Typography } from '@mui/material'

const LoadingPage = () => {
  return (
    <Stack p={10} height={'100%'} justifyContent={'center'}>
      <Typography textAlign={'center'}>Loading...</Typography>
      <LinearProgress />
    </Stack>
  )
}

export default LoadingPage