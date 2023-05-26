import { Stack, Typography, useTheme, Box, Theme } from '@mui/material'
import GestureIcon from '@mui/icons-material/Gesture'

const BoardPreview = ({ theme }: { theme: Theme }) => {
  return (
    <Box
      width={350}
      height={200}
      sx={{ borderRadius: 2 }}
      bgcolor={theme.palette.grey['500']}
      p={1}
    >
      <Stack direction={'row'} justifyContent={'space-between'} width={'100%'} height={'5%'}>
        <Box width={'3%'} sx={{ borderRadius: 1 }} bgcolor={theme.palette.secondary.dark} />
        <Box width={'30%'} sx={{ borderRadius: 1 }} bgcolor={theme.palette.secondary.dark} />
        <Box width={'10%'} sx={{ borderRadius: 1 }} bgcolor={theme.palette.secondary.dark} />
      </Stack>
      <Box
        width={'100%'}
        height={'90%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        flexDirection={'column'}
      >
        <Typography variant={'h5'}>Board</Typography>
        <GestureIcon fontSize={'large'} />
      </Box>
      <Box
        width={'15%'}
        height={'5%'}
        sx={{ borderRadius: 1 }}
        bgcolor={theme.palette.secondary.dark}
        mt={'auto'}
      />
    </Box>
  )
}

const LandingPage = () => {
  const theme = useTheme()

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack justifyContent={'center'} direction={'row'} height={'100%'} maxWidth='xl'>
        <Box width={'50%'} mt={10}>
          <Typography variant={'h2'} color={theme.palette.primary.main} px={5}>
            Darkboard
          </Typography>
          <Typography variant={'subtitle1'} color={theme.palette.primary.dark} px={5}>
            Darkboard is an innovative application that provides users with a digital whiteboard
            experience in a sleek and visually captivating dark theme. With its intuitive interface
            and versatile tools, Darkboard enables users to unleash their creativity, collaborate in
            real-time, and bring their ideas to life effortlessly.
          </Typography>
        </Box>
        <Box width={'50%'} mt={10}>
          <Stack spacing={2}>
            <Typography variant={'h4'} color={theme.palette.primary.main}>
              Create new Board
            </Typography>
            <BoardPreview theme={theme} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export default LandingPage
