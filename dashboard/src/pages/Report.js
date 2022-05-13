import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ListItemText,
  Checkbox,
  OutlinedInput,
  Divider,
} from '@material-ui/core'

import { db } from '../Firebase/index'
import {
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
}

const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const Years = ['2021', '2022', '2023', '2024', '2025']

const Report = () => {
  const [hotspotNames, setHotspotNames] = useState([])
  const [tableData, setTableData] = useState([])
  const [mobileDevices, setMobileDevices] = useState([])
  const [phoneNumbers, setPhoneNumbers] = useState([])

  const [filter, setFilter] = useState(false)
  const [selectedHotspotNames, setSelectedHotspotNames] = useState([])
  const [selectedHotspots, setSelectedHotspots] = useState([])
  const [selectedDevices, setSelectedDevices] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const [notFound, setNotFound] = useState(false)

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  //Get All Hotspots
  useEffect(() => {
    const getHotspots = async () => {
      try {
        const ref = collection(db, 'trackingHotspots')
        const q = query(ref, where('createdBy', '==', userData.uid))

        const snaps = await getDocs(q)
        const array = []
        snaps.forEach((document) => {
          array.push({ ...document.data(), id: document.id })
        })

        const newArr = array.map((item) => {
          return { hotspotName: item.hotspotName, id: item.id }
        })

        setHotspotNames(newArr)
      } catch (error) {
        console.log(error)
      }
    }

    getHotspots()
  }, [])

  // Get All Users
  useEffect(() => {
    const getPhoneNumbers = async () => {
      try {
        const trackingUserRef = collection(db, 'trackingUsers')
        const q = query(trackingUserRef, where('senderId', '==', userData.uid))

        const snaps = await getDocs(q)
        const users = []
        const numbers = []
        snaps.forEach((document) => {
          users.push({ ...document.data(), id: document.id })
          numbers.push(document.data().phoneNumber)
        })
        setPhoneNumbers(numbers)
        setMobileDevices(users)
      } catch (error) {
        console.log(error)
      }
    }

    getPhoneNumbers()
  }, [])

  // get All Data
  useEffect(() => {
    const getDocuments = async () => {
      try {
        const ref = collection(db, 'trackingAttendance')
        const q = query(ref, where('phoneNumber', 'in', phoneNumbers))
        const snaps = await getDocs(q)
        const documents = []
        snaps.forEach((snap) => {
          documents.push(snap.data())
        })

        const filteredDocument = documents.filter((x) =>
          Object.keys(x).includes(userData.uid)
        )

        await getTableData(filteredDocument, hotspotNames, false)
      } catch (error) {
        console.log(error)
      }
    }

    if (phoneNumbers.length !== 0) {
      getDocuments()
    }
  }, [phoneNumbers])

  // function to get Table data and filtered Table data
  const getTableData = async (documents, hotspotNames, isFilter) => {
    const finalArr = []

    documents.forEach((item) => {
      // table row
      const tempArr = [] // array to store count for all hotspots
      const obj = {} // obj to store the device info
      hotspotNames.forEach((hotspot) => {
        // table column
        if (item[userData.uid][hotspot.id] !== undefined) {
          // checking if that hotspot exist fot that device
          if (selectedMonth.length === 0) {
            //  checking for month filter
            obj['deviceName'] = item.phoneNumber
            tempArr.push(item[userData.uid][hotspot.id].totalCount.length)
          } else {
            const year = new Date().getFullYear()
            const month = Months.indexOf(selectedMonth) + 1 // getting selecting months index

            obj['deviceName'] = item.phoneNumber
            const data = item[userData.uid][hotspot.id][year][month] // getting data of that particular month of current year

            if (data !== undefined) {
              // checking if data of selected month exist
              tempArr.push(data.length)
              setNotFound(false) // setting not found flag to false
            } else {
              setNotFound(true)
            }
          }
        } else {
          obj['deviceName'] = item.phoneNumber // if hotspot doesn't exist for that user then
          tempArr.push(0) // puttting --
        }
      })

      obj['data'] = tempArr
      finalArr.push(obj)
    })

    if (!isFilter) {
      setTableData(finalArr)
    } else {
      setFilteredData(finalArr)
      setFilter(true)
    }
  }

  // handling hotspot selection
  const handleHotspotSelect = (event) => {
    const {
      target: { value },
    } = event
    setSelectedHotspotNames(
      typeof value === 'string' ? value.split(',') : value
    )
  }

  // handling device selection
  const handleSelectedDevice = (event) => {
    const {
      target: { value },
    } = event
    setSelectedDevices(typeof value === 'string' ? value.split(',') : value)
  }

  // removing all filters
  const removeFilter = () => {
    setSelectedMonth('')
    setSelectedHotspotNames([])
    setSelectedDevices([])
    setFilter(false)
    setNotFound(false)
  }

  // applying filters
  const applyFilter = async () => {
    let hotspots = []
    if (selectedHotspotNames.length !== 0) {
      selectedHotspotNames.forEach((x) => {
        const temp = hotspotNames
        const filterArr = temp.filter((item) => item.hotspotName === x)
        hotspots.push(...filterArr)
      })
    } else {
      hotspots = hotspotNames
    }

    setSelectedHotspots(hotspots)

    let numbers = []
    if (selectedDevices.length !== 0) {
      selectedDevices.map((x, i) => {
        const number = x.split(' - ')[1]
        numbers.push(number)
      })
    } else {
      numbers = phoneNumbers
    }

    try {
      const ref = collection(db, 'trackingAttendance')
      const q = query(ref, where('phoneNumber', 'in', numbers))
      const snaps = await getDocs(q)
      const documents = []
      snaps.forEach((snap) => {
        documents.push(snap.data())
      })

      await getTableData(documents, hotspots, true)
    } catch (error) {
      console.log(error)
    }
  }

  console.log(tableData)

  return (
    <Box sx={{ p: 5 }}>
      <Card sx={{ p: 4, boxShadow: 4, borderRadius: 5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pb: 3,
          }}
        >
          <Typography sx={{ p: 1 }} component='h1' variant='h3'>
            Filter By :
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='flex-start'
            >
              <Typography variant='h4'>Month: </Typography>
              <FormControl variant='outlined' sx={{ width: '250px', ml: 3 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label='Month'
                >
                  {Months.map((month, i) => (
                    <MenuItem sx={{ py: 1.2, px: 2 }} key={i} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          <Grid item xs={4}>
            <Stack direction='row' alignItems='center' justifyContent='center'>
              <Typography variant='h4'>Hotspots: </Typography>
              <FormControl variant='outlined' sx={{ width: '250px', ml: 3 }}>
                <InputLabel id='hotspotFilter'>Hotspots</InputLabel>
                <Select
                  id='hotspotFilter'
                  multiple
                  value={selectedHotspotNames}
                  onChange={handleHotspotSelect}
                  input={<OutlinedInput label='Hotspots' />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {hotspotNames.map((hotspot, i) => (
                    <MenuItem key={i} value={hotspot.hotspotName}>
                      <Checkbox
                        checked={
                          selectedHotspotNames.indexOf(hotspot.hotspotName) > -1
                        }
                      />
                      <ListItemText primary={hotspot.hotspotName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          <Grid item xs={4}>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='flex-end'
            >
              <Typography variant='h4'>Devices: </Typography>
              <FormControl variant='outlined' sx={{ width: '250px', ml: 3 }}>
                <InputLabel>Mobile Devices</InputLabel>
                <Select
                  label='Mobile Devices'
                  multiple
                  value={selectedDevices}
                  onChange={handleSelectedDevice}
                  input={<OutlinedInput label='Mobile Devices' />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {mobileDevices.map((device, i) => (
                    <MenuItem
                      key={i}
                      value={`${device.fullName} - ${device.phoneNumber}`}
                    >
                      <Checkbox
                        checked={
                          selectedDevices.indexOf(
                            `${device.fullName} - ${device.phoneNumber}`
                          ) > -1
                        }
                      />
                      <ListItemText
                        primary={`${device.fullName} - ${device.phoneNumber}`}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 4,
        }}
      >
        <Button
          variant='contained'
          sx={{ py: 1.3, px: 4, fontSize: 15 }}
          onClick={applyFilter}
        >
          Apply Filter
        </Button>
        <Button
          variant='contained'
          sx={{ py: 1.3, px: 4, fontSize: 15 }}
          onClick={removeFilter}
        >
          Remove Filter
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ my: 4, borderRadius: 5, boxShadow: 4 }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: '#ededed' }}>
            <TableRow>
              <TableCell>Device Name</TableCell>

              {filter && selectedHotspots.length !== 0 ? (
                <>
                  {selectedHotspots.map((x, i) => (
                    <TableCell key={i} align='center'>
                      {x.hotspotName}
                    </TableCell>
                  ))}
                </>
              ) : (
                <>
                  {hotspotNames.map((x, i) => (
                    <TableCell key={i} align='center'>
                      {x.hotspotName}
                    </TableCell>
                  ))}
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {notFound === false && (
              <>
                {filter && filteredData.length !== 0 ? (
                  <>
                    {filteredData.map((x, index) => (
                      <TableRow key={index}>
                        <TableCell
                          component='th'
                          scope='row'
                          sx={{ fontWeight: '600', fontSize: 15 }}
                        >
                          {x.deviceName}
                        </TableCell>
                        {x.data.map((i) => (
                          <TableCell align='center' sx={{ fontSize: 15 }}>
                            {i}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    {tableData.map((x, index) => (
                      <TableRow key={index}>
                        <TableCell
                          component='th'
                          scope='row'
                          sx={{ fontWeight: '600', fontSize: 15 }}
                        >
                          {x.deviceName}
                        </TableCell>
                        {x.data.map((i) => (
                          <TableCell align='center' sx={{ fontSize: 15 }}>
                            {i}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                )}
              </>
            )}
          </TableBody>
        </Table>
        {notFound === true && (
          <Typography sx={{ textAlign: 'center', my: 2 }} variant='h4'>
            No Data Found
          </Typography>
        )}
      </TableContainer>
    </Box>
  )
}

export default Report
