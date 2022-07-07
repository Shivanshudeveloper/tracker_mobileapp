import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Create from '@mui/icons-material/Create'
import moment from 'moment'
import { getGroups, deleteGroup } from '../../store/actions/group'

const GroupTable = (props) => {
  // const [groups, setGroups] = useState([])

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  const adminData = sessionStorage.getItem('adminData')
    ? JSON.parse(sessionStorage.getItem('adminData'))
    : null

  const dispatch = useDispatch()
  const groups = useSelector((state) => state.groups)
  const { groupList } = groups

  useEffect(async () => {
    if (userData !== null && adminData === null) {
      dispatch(getGroups(userData.uid))
    }

    // if (adminData !== null && userData !== null) {
    //   const { data } = await axios.get(
    //     `${API_SERVICE}/get/admin/${adminData.email}`,
    //   )

    // }
  }, [dispatch, userData])

  const removeGroup = (row) => {
    dispatch(deleteGroup(row._id))
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Group Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Admins
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Schedule
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Hotspot/s Added
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Created At
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Modified At
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupList.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.groupName}
                </TableCell>
                <TableCell align="center">
                  {row.admins.length === 0 && <>---</>}
                  {row.admins.map((x, i) => (
                    <React.Fragment key={i}>
                      {`${x.fullName}
                        ${i !== row.admins.length - 1 ? ', ' : ''}`}
                    </React.Fragment>
                  ))}
                </TableCell>

                {Object.entries(row.schedule).length !== 0 ? (
                  <TableCell align="center">
                    {`${row.schedule.startDay} to ${row.schedule.endDay} , ${row.schedule.time.startTime} to ${row.schedule.time.endTime}`}
                  </TableCell>
                ) : (
                  <TableCell align="center">---</TableCell>
                )}

                <TableCell align="center">
                  {row.hotspots.length === 0 && <>---</>}
                  {row.hotspots.map((x, i) => (
                    <React.Fragment key={i}>
                      {`${x.hotspotName}
                        ${i !== row.hotspots.length - 1 ? ' , ' : ''}`}
                    </React.Fragment>
                  ))}
                </TableCell>

                <TableCell align="center" component="th" scope="row">
                  {moment(row.createdAt).format('DD MMMM YYYY')}
                </TableCell>

                <TableCell align="center" component="th" scope="row">
                  {moment(row.updatedAt).format('DD MMMM YYYY')}
                </TableCell>

                <TableCell align="center" sx={{ p: 0 }}>
                  <IconButton
                    color="success"
                    onClick={() => {
                      props.setSelectedGroup(row)
                      props.setEditOpen(true)
                    }}
                  >
                    <Create />
                  </IconButton>
                  <IconButton color="error" onClick={() => removeGroup(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default React.memo(GroupTable)
