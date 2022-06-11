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

const DeviceFilter = (props) => {
  return (
    <FormControl variant="outlined" sx={{ width: '250px', ml: 3 }}>
      <InputLabel>Mobile Devices</InputLabel>
      <Select
        label="Mobile Devices"
        multiple
        value={props.selectedDevices}
        onChange={props.handleSelectedDevice}
        input={<OutlinedInput label="Mobile Devices" />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={MenuProps}
      >
        {props.mobileDevices.map((device, i) => (
          <MenuItem
            key={i}
            value={`${device.fullName} - ${device.phoneNumber}`}
          >
            <Checkbox
              checked={
                props.selectedDevices.indexOf(
                  `${device.fullName} - ${device.phoneNumber}`,
                ) > -1
              }
            />
            <ListItemText
              primary={`${device.fullName} - ${device.phoneNumber}`}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default React.memo(DeviceFilter)
