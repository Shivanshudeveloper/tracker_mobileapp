import * as React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import moment from 'moment'

function Row(props) {
  const { row } = props
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.device.fullName}
        </TableCell>
        <TableCell align="center">{row.device.phoneNumber}</TableCell>
        {row.data.map((x, i) => (
          <TableCell key={i + 1} align="center">
            {x.count}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" sx={{ my: 2 }} component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">Hotspot</TableCell>
                    <TableCell align="right">Group</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow, index) => (
                    <TableRow key={index + 1}>
                      <TableCell
                        sx={{ borderWidth: 0, padding: '16px' }}
                        component="th"
                        scope="row"
                      >
                        {moment(historyRow.createdAt.seconds * 1000).format(
                          'DD MMMM YYYY - hh:mm a',
                        )}
                      </TableCell>
                      <TableCell sx={{ borderWidth: 0, padding: '16px' }}>
                        {historyRow.address}
                      </TableCell>
                      <TableCell
                        sx={{ borderWidth: 0, padding: '16px' }}
                        align="right"
                      >
                        {historyRow.hotspot}
                      </TableCell>
                      <TableCell
                        sx={{ borderWidth: 0, padding: '16px' }}
                        align="right"
                      >
                        {historyRow.group}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

const ReportTable = (props) => {
  console.log(props.tableData)
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Full Name</TableCell>
            <TableCell align="center">Phone Number</TableCell>
            {props.hotspotNames.map((hotspot, index) => (
              <TableCell key={index} align="center">
                {hotspot.hotspotName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.tableData.map((row) => (
            <Row key={row.device.phoneNumber} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default React.memo(ReportTable)
