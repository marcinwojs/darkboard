import { IconButton, IconButtonProps, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'

export type TooltipButtonProps = IconButtonProps & {
  tipText: string
  mobile?: boolean
}

const StyledIconButton = styled(IconButton)({
  minWidth: '36px',
  minHeight: '36px',
  backgroundColor: 'var(--island-bg-color)',
  px: 0,
  fontSize: '16px',
  color: 'var(--icon-fill-color)',

  ':hover': { backgroundColor: 'var(--button-hover-bg, var(--island-bg-color))' },

  '&.selected': {
    backgroundColor: 'var(--color-primary-light)',
  },
})

const TooltipButton = ({ children, tipText, mobile = false, ...btnProps }: TooltipButtonProps) => {
  return (
    <Tooltip title={tipText}>
      <StyledIconButton
        {...btnProps}
        sx={{
          border: mobile ? 'none' : '1px solid var(--button-border, var(--default-border-color))',
          borderRadius: mobile ? 0 : 'var(--border-radius-lg)',
          ...btnProps.sx,
        }}
      >
        {children}
      </StyledIconButton>
    </Tooltip>
  )
}

export default TooltipButton
