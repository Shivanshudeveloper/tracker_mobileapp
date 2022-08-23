import React from 'react'
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
}
const GroupFilter = (props) => {
  return (
    <FormControl variant="outlined" sx={{ width: '250px', ml: 3 }}>
      <InputLabel id="hotspotFilter">Groups</InputLabel>
      <Select
        id="hotspotFilter"
        multiple
        value={props.selectedGroups}
        onChange={props.handleGroupSelect}
        input={<OutlinedInput label="Groups" />}
        renderValue={() => props.selectedGroupsNames.join(', ')}
        MenuProps={MenuProps}
      >
        {props.groupNames.map((group, i) => (
          <MenuItem key={group._id} value={group._id}>
            <Checkbox checked={props.selectedGroups.indexOf(group._id) > -1} />
            <ListItemText primary={group.groupName} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default React.memo(GroupFilter)
