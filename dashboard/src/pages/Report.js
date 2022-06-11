import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'

import { db } from '../Firebase/index'
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
} from 'firebase/firestore'
import ReportTable from '../components/report/ReportTable'
import HotspotFilter from '../components/report/HotspotFilter'
import DeviceFilter from '../components/report/DeviceFilter'
import MonthFilter from '../components/report/MonthFilter'
import GroupFilter from '../components/report/GroupFilter'

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

const Report = () => {
  const [hotspotNames, setHotspotNames] = useState([])
  const [groupNames, setGroupNames] = useState([])
  const [tableData, setTableData] = useState([])
  const [mobileDevices, setMobileDevices] = useState([])
  const [phoneNumbers, setPhoneNumbers] = useState([])

  const [filter, setFilter] = useState(false)
  const [selectedHotspotNames, setSelectedHotspotNames] = useState([])
  const [selectedGroupNames, setSelectedGroupNames] = useState([])
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

  //Get All Groups
  useEffect(() => {
    const getHotspots = async () => {
      try {
        const ref = collection(db, 'trackingGroups')
        const q = query(ref, where('createdBy', '==', userData.uid))

        const snaps = await getDocs(q)
        const array = []
        snaps.forEach((document) => {
          array.push({ ...document.data(), id: document.id })
        })

        const newArr = array.map((item) => {
          return { groupName: item.groupName, id: item.id }
        })

        setGroupNames(newArr)
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

  useEffect(() => {
    const getFromDB = async (device, hotspot) => {
      return new Promise(async (resolve) => {
        const ref = collection(
          db,
          'trackingAttendance',
          device.phoneNumber,
          userData.uid
        )

        const q = query(ref, where('hotspotId', '==', hotspot.id))
        await getDocs(q).then((res) => {
          resolve({ count: res.docs.length, hotspot: hotspot.hotspotName })
        })
      })
    }

    const getHotspotsData = async (device) => {
      return new Promise(async (resolve) => {
        const arr = []
        for (let hotspot of hotspotNames) {
          const data = await getFromDB(device, hotspot)
          arr.push(data)
        }
        resolve(arr)
      })
    }

    const getCollapseData = async (device) => {
      return new Promise(async (resolve) => {
        const ref = collection(
          db,
          'trackingLocations',
          device.phoneNumber,
          'locations'
        )
        const q = query(
          ref,
          where('trackerId', '==', userData.uid),
          orderBy('createdAt', 'desc'),
          limit(100)
        )

        const snaps = await getDocs(q)
        const arr = []
        snaps.forEach((snap) => {
          const data = snap.data()
          arr.push(data)
        })

        resolve(arr)
      })
    }

    const getDocuments = async () => {
      const dataArr = []

      for (let device of mobileDevices) {
        const finalData = {}
        const history = await getCollapseData(device)
        const data = await getHotspotsData(device)
        finalData['history'] = history
        finalData['data'] = data
        finalData['device'] = {
          phoneNumber: device.phoneNumber,
          fullName: device.fullName,
        }
        dataArr.push(finalData)
      }

      setTableData(dataArr)
    }

    if (phoneNumbers.length !== 0 && mobileDevices.length !== 0) {
      getDocuments()
    }
  }, [phoneNumbers, mobileDevices])

  // get All Data
  // useEffect(() => {
  //   const getDocuments = async () => {
  //     console.log(mobileDevices, phoneNumbers)
  //     try {
  //       const ref = collection(db, 'trackingAttendance')
  //       const q = query(ref, where('phoneNumber', 'in', phoneNumbers))
  //       const snaps = await getDocs(q)
  //       const documents = []
  //       snaps.forEach((snap) => {
  //         documents.push(snap.data())
  //       })

  //       const filteredDocument = documents.filter((x) =>
  //         Object.keys(x).includes(userData.uid)
  //       )

  //       console.log(filteredDocument)

  //       await getTableData(filteredDocument, hotspotNames, false)
  //         .then((arr) => {
  //           console.log('Here')
  //           setTableData(arr)
  //         })
  //         .catch((error) => console.log(error))
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   if (phoneNumbers.length !== 0 && mobileDevices.length !== 0) {
  //     getDocuments()
  //   }
  // }, [phoneNumbers, mobileDevices])

  // const getCollapseData = async (phoneNumber) => {
  //   return new Promise(async (resolve) => {
  //     const ref = collection(db, 'trackingLocations', phoneNumber, 'locations')
  //     const q = query(
  //       ref,
  //       where('trackerId', '==', userData.uid),
  //       orderBy('createdAt', 'desc'),
  //       limit(100)
  //     )

  //     const snaps = await getDocs(q)
  //     const arr = []
  //     snaps.forEach((snap) => {
  //       const data = snap.data()
  //       arr.push(data)
  //     })

  //     resolve(arr)
  //   })
  // }

  // const getDataByHotspot = async (hotspot, item) => {
  //   return new Promise((resolve) => {
  //     const colObj = {}
  //     if (item[userData.uid][hotspot.id] !== undefined) {
  //       if (selectedMonth.length === 0) {
  //         colObj['count'] = item[userData.uid][hotspot.id].totalCount.length
  //         resolve(colObj)
  //       } else {
  //         const year = new Date().getFullYear()
  //         const month = Months.indexOf(selectedMonth) + 1

  //         const data = item[userData.uid][hotspot.id][year][month]

  //         if (data !== undefined) {
  //           colObj['count'] = data
  //           setNotFound(false)
  //           resolve(colObj)
  //         } else {
  //           setNotFound(true)
  //           resolve(colObj)
  //         }
  //       }
  //     } else {
  //       colObj['count'] = 0
  //       resolve(colObj)
  //     }
  //   })
  // }

  // const getDataForEachDevice = async (item, hotspotNames) => {
  //   return new Promise(async (resolve) => {
  //     const tempArr = []
  //     for (let hotspot of hotspotNames) {
  //       const colObj = await getDataByHotspot(hotspot, item)
  //       tempArr.push(colObj)
  //     }

  //     resolve(tempArr)
  //   })
  // }

  // // function to get Table data and filtered Table data
  // const getTableData = async (documents, hotspotNames, isFilter) => {
  //   return new Promise(async (resolve) => {
  //     const finalArr = []

  //     for (let item of documents) {
  //       const tempArr = await getDataForEachDevice(item, hotspotNames)
  //       const history = await getCollapseData(item.phoneNumber)

  //       console.log(mobileDevices)
  //       const name = mobileDevices.filter(
  //         (x) => x.phoneNumber === item.phoneNumber
  //       )
  //       console.log(name)
  //       const obj = {}

  //       obj['device'] = {
  //         fullName: name[0].fullName,
  //         phoneNumber: item.phoneNumber,
  //       }
  //       obj['data'] = tempArr
  //       obj['history'] = history
  //       finalArr.push(obj)
  //     }

  //     resolve(finalArr)
  //   })

  //   // if (!isFilter) {
  //   //   setTableData(finalArr)
  //   // } else {
  //   //   setFilteredData(finalArr)
  //   //   setFilter(true)
  //   // }
  // }

  // handling hotspot selection
  const handleHotspotSelect = async (event) => {
    const {
      target: { value },
    } = event
    setSelectedHotspotNames(
      typeof value === 'string' ? value.split(',') : value
    )
  }

  // handling group selection
  const handleGroupSelect = async (event) => {
    const {
      target: { value },
    } = event
    setSelectedGroupNames(typeof value === 'string' ? value.split(',') : value)
  }

  // handling device selection
  const handleSelectedDevice = (event) => {
    const {
      target: { value },
    } = event
    setSelectedDevices(typeof value === 'string' ? value.split(',') : value)
  }

  // // removing all filters
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

      // await getTableData(documents, hotspots, true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box sx={{ p: 5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 4,
        }}
      >
        <MonthFilter
          Months={Months}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />

        <HotspotFilter
          handleHotspotSelect={handleHotspotSelect}
          selectedHotspotNames={selectedHotspotNames}
          hotspotNames={hotspotNames}
        />

        <GroupFilter
          handleGroupSelect={handleGroupSelect}
          selectedGroupNames={selectedGroupNames}
          groupNames={groupNames}
        />

        <DeviceFilter
          handleSelectedDevice={handleSelectedDevice}
          selectedDevices={selectedDevices}
          mobileDevices={mobileDevices}
        />

        <Button variant='outlined' sx={{ py: 1.3, px: 4, fontSize: 15 }}>
          Export Report
        </Button>
      </Box>

      <Box sx={{ my: 4 }}>
        <ReportTable tableData={tableData} hotspotNames={hotspotNames} />
      </Box>

      {/* <TableContainer component={Paper} sx={{ my: 4, boxShadow: 6 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className='table-head'>Device Name</TableCell>

              {filter && selectedHotspots.length !== 0 ? (
                <>
                  {selectedHotspots.map((x, i) => (
                    <TableCell className='table-head' key={i} align='center'>
                      {x.hotspotName}
                    </TableCell>
                  ))}
                </>
              ) : (
                <>
                  {hotspotNames.map((x, i) => (
                    <TableCell className='table-head' key={i} align='center'>
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
      </TableContainer> */}
    </Box>
  )
}

export default Report
