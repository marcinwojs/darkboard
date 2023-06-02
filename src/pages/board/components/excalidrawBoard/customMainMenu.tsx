import { Stack, Typography } from '@mui/material'
import { MainMenu } from '@excalidraw/excalidraw'

type Props = {
  boardName: string
}
const CustomMainMenu = ({ boardName }: Props) => {
  return (
    <MainMenu>
      <Stack>
        <Typography pl={1} fontSize={'small'}>
          Board
        </Typography>
        <Typography pl={1} variant={'h6'}>
          {boardName}
        </Typography>
      </Stack>
      <MainMenu.Separator />
      <MainMenu.DefaultItems.SaveToActiveFile />
      <MainMenu.DefaultItems.SaveAsImage />
      <MainMenu.DefaultItems.Help />
      <MainMenu.DefaultItems.ClearCanvas />
      <MainMenu.Separator />
      <MainMenu.DefaultItems.ChangeCanvasBackground />
    </MainMenu>
  )
}

export default CustomMainMenu
