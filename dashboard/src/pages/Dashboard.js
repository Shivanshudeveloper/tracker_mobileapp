import React from 'react'
import { Box, Container } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import {
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon
} from '@material-ui/core';


import { Search as SearchIcon } from 'react-feather';

const Dashboard = () => {

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create a new user</DialogTitle>
        <DialogContent>

          <TextField id="outlined-basic" fullWidth sx={{ mb: 2, mt: 4 }} label="Full Name" variant="outlined" />
          <TextField id="outlined-basic" fullWidth sx={{ mb: 2 }}  label="Email" variant="outlined" />
          <TextField id="outlined-basic" fullWidth sx={{ mb: 2 }}  label="Phone Number" variant="outlined" />
          <TextField id="outlined-basic" fullWidth sx={{ mb: 2 }}  label="Designation" variant="outlined" />
          <TextField id="outlined-basic" fullWidth sx={{ mb: 2 }}  label="Salary" variant="outlined" />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>



    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <h2 style={{ marginBottom: '10px' }}>
          Users
        </h2>
        
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleClickOpen}
            >
              Add user
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ maxWidth: 500 }}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Search user"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <TableContainer sx={{ mt: 2 }} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Phone No.</TableCell>
                <TableCell align="right">Job Title</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow key={1}>
                <TableCell component="th" scope="row">
                  Shivanshu Gupta
                </TableCell>
                <TableCell align="right">
                  shivanshu@gmail.com
                </TableCell>
                <TableCell align="right">
                  +91 8273-293-332
                </TableCell>
                <TableCell align="right">
                  Software Engineer
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Location">
                    <IconButton onClick={() => window.location.href = "/app/locationview"} color="primary" aria-label="upload picture" component="span">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete User">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit User">
                    <IconButton color="primary" aria-label="upload picture" component="span">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>



      </Container>
    </Box>
    </>
  )
}

export default Dashboard
