import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const MonthFilter = (props) => {
  return (
    <FormControl variant="outlined" sx={{ width: '250px', ml: 3 }}>
      <InputLabel>Month</InputLabel>
      <Select
        value={props.selectedMonth}
        onChange={(e) => props.setSelectedMonth(e.target.value)}
        label="Month"
      >
        {props.Months.map((month, i) => (
          <MenuItem sx={{ py: 1.2, px: 2 }} key={i} value={month}>
            {month}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default React.memo(MonthFilter)
