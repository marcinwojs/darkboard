import { IconButton, IconButtonProps, Tooltip } from '@mui/material'

type Props = IconButtonProps & {
  tipText: string
}

const TooltipButton = ({ children, tipText, ...btnProps }: Props) => {
  return (
    <Tooltip title={tipText}>
      <IconButton {...btnProps}>{children} </IconButton>
    </Tooltip>
  )
}

export default TooltipButton
