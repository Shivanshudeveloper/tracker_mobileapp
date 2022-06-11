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

const HotspotFilter = (props) => {
  return (
    <FormControl variant="outlined" sx={{ width: '250px', ml: 3 }}>
      <InputLabel id="hotspotFilter">Hotspots</InputLabel>
      <Select
        id="hotspotFilter"
        multiple
        value={props.selectedHotspotNames}
        onChange={props.handleHotspotSelect}
        input={<OutlinedInput label="Hotspots" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {props.hotspotNames.map((hotspot, i) => (
          <MenuItem key={i} value={hotspot.hotspotName}>
            <Checkbox
              checked={
                props.selectedHotspotNames.indexOf(hotspot.hotspotName) > -1
              }
            />
            <ListItemText primary={hotspot.hotspotName} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default React.memo(HotspotFilter)
