import React from 'react'
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Delete, Create } from '@mui/icons-material'

const AdminTable = (props) => {
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein }
  }

  const rows = [
    createData('Gaurav Ojha', 159984989, 1111111111, 'gaurav@email.com', 4.0),
    createData('Mehul Kain', 237848494, 9999999999, 'mehul@email.com', 4.3),
    createData(
      'Shubham Rawat',
      2624834889,
      1616161616,
      'shubham@email.com',
      6.0,
    ),
    createData(
      'Muskan Qureshi',
      305489844,
      3333333333,
      'muskan@email.com',
      4.3,
    ),
    createData('Rohit Pawar', 3568383948, 1611611611, 'rohit@email.com', 3.9),
  ]

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
                Phone Number
              </TableCell>
              <TableCell className="table-head" align="center">
                Email
              </TableCell>
              <TableCell className="table-head" align="center">
                Groups
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
                <TableCell align="center">+91 {row.phoneNumber}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">
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
                <TableCell align="center" sx={{ p: 0 }}>
                  <IconButton color="success">
                    <Create />
                  </IconButton>
                  <IconButton color="error">
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
