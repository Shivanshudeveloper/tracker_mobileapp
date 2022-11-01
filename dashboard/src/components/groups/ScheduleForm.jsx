import React from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { useEffect } from 'react'

const ScheduleForm = (props) => {
  const week = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  return (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}
      >
        <FormControl fullWidth variant="outlined">
          <InputLabel id="Start Day">Start Day</InputLabel>
          <Select
            labelId="Start Day"
            value={props.startDay}
            onChange={(e) => props.setStartDay(e.target.value)}
            label="Start Day"
          >
            {week.map((day, i) => (
              <MenuItem key={i} value={day} sx={{ p: 1.2 }}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel id="End Day">End Day</InputLabel>
          <Select
            labelId="Emd Day"
            value={props.endDay}
            onChange={(e) => props.setEndDay(e.target.value)}
            label="End Day"
          >
            {week.map((day, i) => (
              <MenuItem key={i} value={day} sx={{ p: 1.2 }}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          height: '58px',
          display: 'flex',
          mb: 2,
          mt: 3,
          gap: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            label="Start Time"
            value={props.time.startTime}
            onChange={(newValue) => {
              props.setTime({ ...props.time, startTime: newValue })
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            label="End Time"
            value={props.time.endTime}
            onChange={(newValue) => {
              props.setTime({ ...props.time, endTime: newValue })
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>
    </Box>
  )
}

export default React.memo(ScheduleForm)
