import { rectNote } from '../../../../../libraries/stickyNotes/rectNote'
import CustomTool from '../../customTool/customTool'
import NoteIcon from '@mui/icons-material/Note'
import CustomToolsIsland from '../../customTool/customToolsIsland'

const StickyNotes = () => {
  return (
    <CustomToolsIsland
      tipText={'Sticky Notes'}
      menuContent={
        <>
          <CustomTool {...rectNote('#7950f2')} />
          <CustomTool {...rectNote('#fd7e14')} />
          <CustomTool {...rectNote('#fa5252')} />
          <CustomTool {...rectNote('#40c057')} />
          <CustomTool {...rectNote('#228be6')} />
        </>
      }
    >
      <NoteIcon />
    </CustomToolsIsland>
  )
}

export default StickyNotes
