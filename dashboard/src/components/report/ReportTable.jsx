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
import { CircularProgress } from '@mui/material'
import moment from 'moment'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

function Row(props) {
  const {
    row,
    hotspotList,
    selectedHotspots,
    selectedGroups,
    selectedMonth,
  } = props
  const [open, setOpen] = React.useState(false)
  const [history, setHistory] = React.useState([])
  const [load, setLoad] = React.useState(false)

  const userData = localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))
    : null

  const arr = row.hotspots.map((x) => x.hotspot)

  const checkExist = (x) => {
    const i = arr.findIndex((e) => e === x._id)
    return i
  }

  const filterGroup = async (data) => {
    return new Promise((resolve) => {
      const arr = []

      for (let id of selectedGroups) {
        console.log('inside')
        for (let x of data) {
          if (id === x.group._id) {
            arr.push(x)
          }
        }
      }
      console.log('Here')
      resolve(arr)
    })
  }

  React.useEffect(async () => {
    try {
      setLoad(true)
      const { data } = await axios.get(
        `${API_SERVICE}/get/location/${userData.uid}/${row.phoneNumber}/${
          selectedMonth + 1
        }`,
      )

      if (selectedGroups.length === 0) {
        setHistory(data)
        setLoad(false)
      } else {
        const arr = await filterGroup(data)

        setHistory(arr)
        setLoad(false)
      }
    } catch (error) {
      console.log(error.message)
    }
  }, [selectedGroups])

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
          {row.device}
        </TableCell>
        <TableCell align="center">{row.phoneNumber}</TableCell>

        {selectedHotspots.length === 0 &&
          hotspotList.map((x, i) => (
            <React.Fragment key={x.hotspot}>
              {checkExist(x) !== -1 ? (
                <TableCell key={x.hotspot} align="center">
                  {row.hotspots[checkExist(x)].total}
                </TableCell>
              ) : (
                <TableCell key={x.hotspot} align="center">
                  0
                </TableCell>
              )}
            </React.Fragment>
          ))}
        {selectedHotspots.length !== 0 &&
          selectedHotspots.map((x, i) => (
            <React.Fragment key={x.hotspot}>
              {checkExist(x) !== -1 ? (
                <TableCell key={x.hotspot} align="center">
                  {row.hotspots[checkExist(x)].total}
                </TableCell>
              ) : (
                <TableCell key={x.hotspot} align="center">
                  0
                </TableCell>
              )}
            </React.Fragment>
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
                  {!load &&
                    history.map((historyRow, index) => (
                      <TableRow key={index + 1}>
                        <TableCell
                          sx={{ borderWidth: 0, padding: '16px' }}
                          component="th"
                          scope="row"
                        >
                          {moment(historyRow.createdAt).format(
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
                          {historyRow.hotspot.hotspotName}
                        </TableCell>
                        <TableCell
                          sx={{ borderWidth: 0, padding: '16px' }}
                          align="right"
                        >
                          {historyRow.group.groupName}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {load && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    my: 3,
                  }}
                >
                  <CircularProgress sx={{ fontSize: 30 }} />
                </Box>
              )}
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
            {props.selectedHotspots.length === 0 &&
              props.hotspotList.map((hotspot, index) => (
                <TableCell key={hotspot._id} align="center">
                  {hotspot.hotspotName}
                </TableCell>
              ))}
            {props.selectedHotspots.length !== 0 &&
              props.selectedHotspots.map((hotspot, index) => (
                <TableCell key={hotspot._id} align="center">
                  {hotspot.hotspotName}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.tableData.length !== 0 &&
            props.tableData.map((row) => (
              <Row
                key={row.phoneNumber}
                row={row}
                hotspotList={props.hotspotList}
                selectedHotspots={props.selectedHotspots}
                selectedGroups={props.selectedGroups}
                selectedMonth={props.selectedMonth}
              />
            ))}

          {props.tableData.length === 0 &&
            props.deviceList.map((row) => (
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                  <IconButton aria-label="expand row" size="small">
                    <KeyboardArrowUpIcon />
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.fullName}
                </TableCell>
                <TableCell align="center">{row.phoneNumber}</TableCell>

                {props.selectedHotspots.length === 0 &&
                  props.hotspotList.map((x, i) => (
                    <React.Fragment key={x.hotspot}>
                      <TableCell key={x.hotspot} align="center">
                        0
                      </TableCell>
                    </React.Fragment>
                  ))}
                {props.selectedHotspots.length !== 0 &&
                  props.selectedHotspots.map((x, i) => (
                    <React.Fragment key={x.hotspot}>
                      <TableCell key={x.hotspot} align="center">
                        0
                      </TableCell>
                    </React.Fragment>
                  ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default React.memo(ReportTable)
