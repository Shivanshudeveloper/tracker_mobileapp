import React, { useEffect, useState } from 'react'
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
import { db } from '../../Firebase/index'
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import moment from 'moment'

const GroupTable = (props) => {
  const { open, success, error } = props

  const [groups, setGroups] = useState([])

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  //Get All Hotspots
  useEffect(() => {
    const ref = collection(db, 'trackingGroups')
    const q = query(ref, where('createdBy', '==', userData.uid))

    const unsub = onSnapshot(q, (snapshot) => {
      const array = []
      snapshot.forEach((document) => {
        array.push({ ...document.data(), id: document.id })
      })

      setGroups(array)
    })

    return () => unsub()
  }, [])

  const deleteGroup = async (group) => {
    await deleteDoc(doc(db, 'trackingGroups', group.id))
      .then(async () => {
        const hotspots = group.hotspot

        if (hotspots !== undefined) {
          for (let hotspot of hotspots) {
            updateDoc(doc(db, 'trackingHotspots', hotspot.id), {
              groups: arrayRemove({
                groupName: group.groupName,
                id: group.id,
              }),
            }).catch((err) => {
              error(err.message)
              open(true)
            })
          }
        }
      })
      .then(async () => {
        const users = group.members

        if (users !== undefined) {
          for (let user of users) {
            const q = query(
              collection(db, 'trackingUsers'),
              where('phoneNumber', '==', user),
            )

            const snaps = await getDocs(q)

            snaps.forEach((snap) => {
              if (snap.exists()) {
                updateDoc(doc(db, 'trackingUsers', snap.id), {
                  deviceGroups: arrayRemove({
                    groupName: group.groupName,
                    id: group.id,
                  }),
                }).catch((err) => console.log(err))
              }
            })
          }
        }
      })
      .then(async () => {
        const admins = group.admins

        if (admins !== undefined) {
          for (let admin of admins) {
            updateDoc(doc(db, 'trackerAdmin', admin.id), {
              groups: arrayRemove({
                groupName: group.groupName,
                id: group.id,
              }),
            }).catch((err) => {
              error(err.message)
              open(true)
            })
          }
        }
      })
      .then(() => {
        success('Group Deleted Successfully !!')
        open(true)
      })
      .catch((err) => console.log(err))
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
            {groups.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.groupName}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  {row.admins.length === 0 && <>---</>}
                  {row.admins.map((x, i) => (
                    <div key={i}>
                      <Typography variant="p" component="p">
                        {x.fullName}
                        {i !== row.admins.length - 1 && <>{','}</>}
                      </Typography>
                    </div>
                  ))}
                </TableCell>

                {Object.entries(row.schedule).length !== 0 ? (
                  <TableCell align="center">
                    {`${row.schedule.startDay} to ${row.schedule.endDay} , ${row.schedule.time.startTime} to ${row.schedule.time.endTime}`}
                  </TableCell>
                ) : (
                  <TableCell align="center">---</TableCell>
                )}

                <TableCell
                  align="center"
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  {row.hotspot.length === 0 && <>---</>}
                  {row.hotspot.map((x, i) => (
                    <div key={i}>
                      <Typography variant="p" component="p">
                        {x.hotspotName}
                        {i !== row.hotspot.length - 1 && <>{' , '}</>}
                      </Typography>
                    </div>
                  ))}
                </TableCell>

                <TableCell align="center" component="th" scope="row">
                  {moment(row.createdAt.seconds * 1000).format('DD MMMM YYYY')}
                </TableCell>

                <TableCell align="center" component="th" scope="row">
                  {moment(row.modifiedAt.seconds * 1000).format('DD MMMM YYYY')}
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
                  <IconButton color="error" onClick={() => deleteGroup(row)}>
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
