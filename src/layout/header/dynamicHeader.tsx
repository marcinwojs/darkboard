import Header from './header'
import { useEffect, useRef, useState } from 'react'
import { HeaderMode, useAppLayoutContext } from '../../providers/appLayoutProvider'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const HeaderWrapper = styled(Box)(() => ({
  transition: 'all 0.3s',
  position: 'absolute',
  zIndex: 100,
  top: '-66px',
  width: '100%',

  '&.open': {
    transition: 'all 0.5s',
    top: '0',
  },
}))

const DynamicHeader = () => {
  const { headerMode, changeHeaderMode } = useAppLayoutContext()
  const headerBoxRef = useRef<HTMLDivElement>(null)
  const [openHeader, setOpenHeader] = useState(false)
  const lastNonFullscreen = useRef<HeaderMode>(HeaderMode.regular)

  useEffect(() => {
    if (headerMode !== 'fullscreen') {
      lastNonFullscreen.current = headerMode

      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
    setOpenHeader(false)
  }, [headerMode])

  const handleCursorIn = (event: MouseEvent) => {
    const y = event.clientY

    if (y >= 10 && y <= 20) {
      setOpenHeader(true)
    }
  }
  const handleMouseLeave = () => {
    setOpenHeader(false)
  }

  const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      changeHeaderMode(HeaderMode.fullscreen)
    } else {
      lastNonFullscreen.current && changeHeaderMode(lastNonFullscreen.current)
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'F11') {
      event.preventDefault()
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.getElementById('fullscreenBtn')?.click()
      }
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleCursorIn)
    window.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    if (headerBoxRef.current) headerBoxRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleCursorIn)
      window.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)

      if (headerBoxRef.current)
        headerBoxRef.current.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [headerMode])

  if (headerMode === 'regular') {
    return <Header />
  }

  return (
    <HeaderWrapper ref={headerBoxRef} className={openHeader ? 'open' : undefined}>
      <Header />
    </HeaderWrapper>
  )
}

export default DynamicHeader
