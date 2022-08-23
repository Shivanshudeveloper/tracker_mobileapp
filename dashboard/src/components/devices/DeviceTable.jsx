import React, { useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Create from '@mui/icons-material/Create'
import { useSelector, useDispatch } from 'react-redux'
import { deleteDevice } from '../../store/actions/device'

const DeviceSetting = (props) => {
  const { toggleEditDeviceDialog } = props

  const devices = useSelector((state) => state.devices)
  const { deviceList } = devices

  const dispatch = useDispatch()

  const removeDevice = (data) => {
    dispatch(deleteDevice(data._id))
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Mobile Number</TableCell>
              <TableCell align="center">Groups Added</TableCell>
              <TableCell align="center">Tracking Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceList.map((data) => (
              <TableRow
                key={data._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {data.fullName}
                </TableCell>
                <TableCell align="center">{data.phoneNumber}</TableCell>
                {data.groups.length === 0 ? (
                  <TableCell align="center">--</TableCell>
                ) : (
                  <TableCell align="center">
                    {data.groups.map((x, i) => (
                      <>
                        {x.groupName}
                        {i !== data.groups.length - 1 && <>{' ,'}</>}
                      </>
                    ))}
                  </TableCell>
                )}

                <TableCell align="center">
                  {data.trackingStatus === 'accepted' && (
                    <Chip label="Accepted" color="success" />
                  )}
                  {data.trackingStatus === 'rejected' && (
                    <Chip label="Rejected" color="error" />
                  )}
                  {data.trackingStatus === 'pending' && (
                    <Chip label="Pending" color="warning" />
                  )}
                  {data.trackingStatus === 'turned off' && (
                    <Chip label="Turned Off" color="error" />
                  )}
                </TableCell>
                <TableCell align="center" sx={{ p: 0 }}>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    color="primary"
                    onClick={() => toggleEditDeviceDialog(data)}
                  >
                    <Create />
                  </IconButton>
                  <IconButton color="error" onClick={() => removeDevice(data)}>
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

export default React.memo(DeviceSetting)
