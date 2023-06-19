import { rectNote } from '../../../../../libraries/stickyNotes/rectNote'
import CustomTool from '../../customTool/customTool'
import NoteIcon from '@mui/icons-material/Note'
import CustomToolsIsland from '../../customTool/customToolsIsland'

const stickyNotesColors = ['#7950f2', '#fd7e14', '#fa5252', '#40c057', '#228be6']

const StickyNotes = () => {
  return (
    <CustomToolsIsland
      tipText={'Sticky Notes'}
      menuContent={
        <>
          {stickyNotesColors.map((color) => (
            <CustomTool key={`stickyNote${color}`} {...rectNote(color)} />
          ))}
        </>
      }
    >
      <NoteIcon fontSize={'inherit'} />
    </CustomToolsIsland>
  )
}

export default StickyNotes
