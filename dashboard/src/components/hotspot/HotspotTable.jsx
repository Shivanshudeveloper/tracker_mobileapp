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
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { deleteHotspot } from '../../store/actions/hotspot'

const HotspotSetting = (props) => {
  const { open, success, error, toggleEditHotspotDialog } = props

  //const [hotspots, setHotspots] = useState([])

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  const adminData = sessionStorage.getItem('adminData')
    ? JSON.parse(sessionStorage.getItem('adminData'))
    : null

  const dispatch = useDispatch()
  const hotspots = useSelector((state) => state.hotspots)
  const { hotspotList } = hotspots

  //Get All Hotspots
  // useEffect(() => {
  //   const ref = collection(db, 'trackingHotspots')
  //   let q
  //   let unsub
  //   if (adminData === null) {
  //     q = query(ref, where('createdBy', '==', userData.uid))

  //     unsub = onSnapshot(q, (snapshot) => {
  //       const array = []
  //       snapshot.forEach((document) => {
  //         array.push({ ...document.data(), id: document.id })
  //       })
  //       setHotspots(array)
  //     })
  //   } else {
  //     const array = []
  //     adminData.groupId.forEach((x) => {
  //       q = query(
  //         ref,
  //         where('createdBy', '==', userData.uid),
  //         where('groupId', 'array-contains-any', adminData.groupId),
  //       )
  //       unsub = onSnapshot(q, (snapshot) => {
  //         snapshot.forEach((document) => {
  //           array.push({ ...document.data(), id: document.id })
  //         })
  //       })
  //     })

  //     setHotspots(array)
  //   }
  // }, [])

  const removeHotspot = (hotspot) => {
    dispatch(deleteHotspot(hotspot._id))
  }

  // const deleteHotspot = async (hotspot) => {
  //   await deleteDoc(doc(db, 'trackingHotspots', hotspot.id))
  //     .then(() => {
  //       const groups = hotspot.groups

  //       for (let group of groups) {
  //         const ref = doc(db, 'trackingGroups', group.id)
  //         updateDoc(ref, {
  //           hotspot: arrayRemove({
  //             hotspotName: hotspot.hotspotName,
  //             id: hotspot.id,
  //             zipCode: hotspot.location.zipCode,
  //           }),
  //         }).catch((err) => console.log(err))
  //       }
  //     })
  //     .then(() => {
  //       success('Hotspot Deleted Successfully !!')
  //       open(true)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Hotspot Name</TableCell>
              <TableCell align="center">Address (Zip Code)</TableCell>
              <TableCell align="center">Groups Added</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotspotList.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.hotspotName}
                </TableCell>
                <TableCell align="center">{row.location.zipCode}</TableCell>
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
                <TableCell align="center" sx={{ p: 0 }}>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    color="primary"
                    onClick={() => toggleEditHotspotDialog(row)}
                    sx={{ mr: 0.2 }}
                  >
                    <Create />
                  </IconButton>
                  <IconButton color="error" onClick={() => removeHotspot(row)}>
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

export default HotspotSetting
