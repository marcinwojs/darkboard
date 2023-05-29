import { createTheme } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'

const theme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#f69536',
      },
      secondary: {
        main: '#bdbdbd',
      },
      background: {
        default: mode === 'dark' ? '#4b4b4b' : '#eeeeee',
        paper: mode === 'dark' ? '#b2b0b0' : '#ffffff',
      },
      error: {
        main: '#d50000',
      },
      info: {
        main: '#42a5f5',
      },
      success: {
        main: '#00e676',
      },
      divider: '#9e9e9e',
    },
  })

export default theme
