import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { PaletteMode, ThemeProvider } from '@mui/material'
import theme from '../theme'
import Cookies from 'js-cookie'

export type AppThemeContextType = {
  mode: PaletteMode
  changeThemeMode: (mode: PaletteMode) => void
}

export const AppThemeContext = createContext<AppThemeContextType>({
  mode: 'dark',
  changeThemeMode: () => null,
})

export const useAppThemeContext = () => useContext<AppThemeContextType>(AppThemeContext)

const AppThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>((Cookies.get('appTheme') as PaletteMode) || 'dark')

  useEffect(() => {
    if (Cookies.get('appTheme') === undefined) {
      Cookies.set('appTheme', 'dark', { expires: 30 })
    }
  }, [])

  const changeThemeMode = (mode: PaletteMode) => {
    setMode(mode)
    Cookies.set('appTheme', mode, { expires: 30 })
  }

  return (
    <AppThemeContext.Provider value={{ changeThemeMode, mode }}>
      <ThemeProvider theme={theme(mode)}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  )
}

export default AppThemeProvider
