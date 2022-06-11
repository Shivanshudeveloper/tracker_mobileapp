import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import moment from 'moment'

const LocationTimeline = (props) => {
  return (
    <Box>
      <Timeline sx={{ px: 0, mr: 4 }}>
        {props.locations.map((location) => (
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot variant="outlined" color="error" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Box sx={{ pb: 1.3 }}>
                <Typography component="h6">{location.address}</Typography>
                <Typography component="p" sx={{ fontSize: 12 }}>
                  {moment(location.createdAt.seconds * 1000).format(
                    'DD MMMM YYYY - hh:mm a',
                  )}
                </Typography>
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  )
}

export default React.memo(LocationTimeline)
