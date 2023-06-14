import { Link, LinkProps } from '@mui/material'

interface Props {
  href?: string
  sx: LinkProps['sx']
  imgHeight?: string
}

const Logo = ({ sx, href, imgHeight = '35px' }: Props) => (
  <Link href={href || '/'} sx={{ ...sx }}>
    <img src={'/logo.png'} height={imgHeight} alt={'Darkboard'} />
  </Link>
)

export default Logo
