import { Link, LinkProps } from '@mui/material'

interface Props {
  href?: string
  sx: LinkProps['sx']
}

const Logo = ({ sx, href }: Props) => (
  <Link href={href || '/'} sx={{ ...sx }}>
    <img src={'/logo.png'} height={'35px'} alt={'Darkboard'} />
  </Link>
)

export default Logo
