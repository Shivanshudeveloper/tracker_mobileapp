import React, { useState } from 'react'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@mui/material'
import TimeRangePicker from '@wojtekmaj/react-timerange-picker'
import { db } from '../../Firebase/index'
import { doc, setDoc } from 'firebase/firestore'

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
            {week.slice(week.indexOf(props.startDay)).map((day, i) => (
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
        }}
      >
        <TimeRangePicker
          disableClock={true}
          onChange={props.setTime}
          value={props.time}
          rangeDivider="-- to --"
        />
      </Box>
    </Box>
  )
}

export default ScheduleForm
