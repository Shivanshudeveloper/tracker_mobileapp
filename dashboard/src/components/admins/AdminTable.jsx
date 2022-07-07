import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Delete, Create } from '@mui/icons-material'
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../Firebase/index'
import moment from 'moment'
import { deleteAdmin } from '../../store/actions/admin'

const AdminTable = (props) => {
  const admins = useSelector((state) => state.admins)
  const { adminList } = admins

  const dispatch = useDispatch()

  const removeAdmin = (admin) => {
    dispatch(deleteAdmin(admin._id))
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell className="table-head">Admin Name</TableCell>
              <TableCell className="table-head" align="center">
                Admin Id
              </TableCell>
              <TableCell className="table-head" align="center">
                Email
              </TableCell>
              <TableCell className="table-head" align="center">
                Groups
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Created At
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Modified At
              </TableCell>
              <TableCell className="table-head" align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminList.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.fullName}
                </TableCell>
                <TableCell align="center">{row._id}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">
                  {row.groups.length === 0 && <>---</>}
                  {row.groups.map((x, i) => (
                    <React.Fragment key={i}>{`${x.groupName} ${
                      i !== row.groups.length - 1 ? ', ' : ''
                    }`}</React.Fragment>
                  ))}
                </TableCell>

                <TableCell align="center">
                  {moment(row.createdAt).format('DD MMM YYYY')}
                </TableCell>

                <TableCell align="center">
                  {moment(row.updatedAt).format('DD MMMM YYYY')}
                </TableCell>

                <TableCell align="center" sx={{ p: 0 }}>
                  <IconButton
                    color="success"
                    onClick={() => {
                      props.setSelectedAdmin(row)
                      props.setShowEditDialog(true)
                    }}
                  >
                    <Create />
                  </IconButton>
                  <IconButton color="error" onClick={() => removeAdmin(row)}>
                    <Delete />
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

export default React.memo(AdminTable)
