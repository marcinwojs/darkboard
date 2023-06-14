import { Link, LinkProps } from '@mui/material'

interface Props {
  href?: string
  sx: LinkProps['sx']
  imgHeight?: string
  small?: boolean
}

const Logo = ({ sx, href, imgHeight = '35px', small = false }: Props) => (
  <Link href={href || '/'} sx={{ ...sx }}>
    <img src={small ? '/DLogo.png' : '/logo.png'} height={imgHeight} alt={'Darkboard'} />
  </Link>
)

export default Logo
