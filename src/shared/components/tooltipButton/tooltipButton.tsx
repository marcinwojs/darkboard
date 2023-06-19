import { IconButton, IconButtonProps, Tooltip } from '@mui/material'

export type TooltipButtonProps = IconButtonProps & {
  tipText: string
}

const TooltipButton = ({ children, tipText, ...btnProps }: TooltipButtonProps) => {
  return (
    <Tooltip title={tipText}>
      <IconButton {...btnProps}>{children} </IconButton>
    </Tooltip>
  )
}

export default TooltipButton
