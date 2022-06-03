import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'

const LocationTimeline = () => {
  const arr = [1, 2, 3, 4, 5]
  return (
    <Box>
      <Timeline sx={{ px: 0, mr: 4 }}>
        {arr.map(() => (
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot variant="outlined" color="error" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Box sx={{ pb: 1.3 }}>
                <Typography component="h6">
                  Mayur Vihar Phase 1, New Delhi 110091
                </Typography>
                <Typography component="p" sx={{ fontSize: 12 }}>
                  2 June 2022, 9.30 pm
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  )
}

export default LocationTimeline
