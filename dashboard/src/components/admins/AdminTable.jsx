import React from 'react'
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

const AdminTable = (props) => {
  const deleteAdmin = async (admin) => {
    const ref = doc(db, 'trackerAdmin', admin.id)
    await deleteDoc(ref)
      .then(() => {
        const groups = admin.groups

        if (groups !== undefined) {
          for (let group of groups) {
            updateDoc(doc(db, 'trackingGroups', group.id), {
              admins: arrayRemove({
                fullName: admin.fullName,
                id: admin.id,
              }),
            }).catch((err) => {
              console.log(err.message)
            })
          }
        }
      })
      .then(() => {
        console.log('Admin Deleted')
      })
      .catch((err) => {
        console.log(err.message)
      })
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
            {props.adminList.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.fullName}
                </TableCell>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell
                  align="center"
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  {row.groups.length === 0 && <>---</>}
                  {row.groups.map((x, i) => (
                    <div key={i}>
                      <Typography variant="p" component="p">
                        {x.groupName}
                        {i !== row.groups.length - 1 && <>{' ,'}</>}
                      </Typography>
                    </div>
                  ))}
                </TableCell>

                <TableCell align="center" component="th" scope="row">
                  {moment(row.createdAt.seconds * 1000).format('DD MMM YYYY')}
                </TableCell>

                <TableCell align="center" component="th" scope="row">
                  {moment(row.modifiedAt.seconds * 1000).format('DD MMMM YYYY')}
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
                  <IconButton color="error" onClick={() => deleteAdmin(row)}>
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
