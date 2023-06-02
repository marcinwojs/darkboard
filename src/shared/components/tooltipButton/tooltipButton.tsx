import { Button, ButtonProps, Tooltip } from '@mui/material'

type Props = ButtonProps & {
  tipText: string
}
const TooltipButton = ({ children, tipText, ...btnProps }: Props) => {
  return (
    <Tooltip title={tipText}>
      <Button {...btnProps}>{children}</Button>
    </Tooltip>
  )
}

export default TooltipButton
