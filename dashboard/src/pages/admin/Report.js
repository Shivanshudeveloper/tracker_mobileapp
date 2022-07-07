import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Backdrop } from '@mui/material'

import { db } from '../../Firebase/index'
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  documentId,
} from 'firebase/firestore'
import ReportTable from '../../components/report/ReportTable'
import HotspotFilter from '../../components/report/HotspotFilter'
import DeviceFilter from '../../components/report/DeviceFilter'
import MonthFilter from '../../components/report/MonthFilter'
import GroupFilter from '../../components/report/GroupFilter'

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

const AdminReport = () => {
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
  const [selectedMonth, setSelectedMonth] = useState(
    Months[new Date().getMonth()]
  )
  const [loading, setLoading] = useState(true)

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  const adminData = sessionStorage.getItem('adminData')
    ? JSON.parse(sessionStorage.getItem('adminData'))
    : null

  //Get All Hotspots
  useEffect(() => {
    const getHotspots = async () => {
      try {
        const ref = collection(db, 'trackingHotspots')
        const q = query(
          ref,
          where('createdBy', '==', userData.uid),
          where('groupId', 'array-contains-any', adminData.groupId)
        )

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
    const getGroups = async () => {
      try {
        const ref = collection(db, 'trackingGroups')
        const q = query(
          ref,
          where('createdBy', '==', userData.uid),
          where(documentId(), 'in', adminData.groupId)
        )

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

    getGroups()
  }, [])

  // Get All Users
  useEffect(() => {
    const getPhoneNumbers = async () => {
      try {
        const trackingUserRef = collection(db, 'trackingUsers')
        const q = query(
          trackingUserRef,
          where('senderId', '==', userData.uid),
          where('groupId', 'array-contains-any', adminData.groupId)
        )

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

  const getHotspotsData = async (device, hotspots) => {
    return new Promise(async (resolve) => {
      const arr = []
      for (let hotspot of hotspots) {
        const data = await getFromDB(device, hotspot)
        arr.push(data)
      }
      resolve(arr)
    })
  }

  const getCollapseData = async (device, hotspots) => {
    return new Promise(async (resolve) => {
      const hotspotName = hotspots.map((x) => {
        return x.hotspotName
      })
      const ref = collection(
        db,
        'trackingLocations',
        device.phoneNumber,
        'locations'
      )
      let q
      console.log(Months.indexOf(selectedMonth), selectedMonth)
      if (selectedGroupNames.length !== 0) {
        q = query(
          ref,
          where('trackerId', '==', userData.uid),
          where('group', 'in', selectedGroupNames),
          where('month', '==', Months.indexOf(selectedMonth) + 1),
          orderBy('createdAt', 'desc'),
          limit(100)
        )
      } else {
        q = query(
          ref,
          where('trackerId', '==', userData.uid),
          where('hotspot', 'in', hotspotName),
          where('month', '==', Months.indexOf(selectedMonth) + 1),
          orderBy('createdAt', 'desc'),
          limit(100)
        )
      }

      const snaps = await getDocs(q)
      const arr = []
      snaps.forEach((snap) => {
        const data = snap.data()
        arr.push(data)
      })
      console.log(arr)
      resolve(arr)
    })
  }

  const getDocuments = async (devices, hotspots) => {
    const dataArr = []

    for (let device of devices) {
      const finalData = {}
      const history = await getCollapseData(device, hotspots)
      const data = await getHotspotsData(device, hotspots)
      finalData['history'] = history
      finalData['data'] = data
      finalData['device'] = {
        phoneNumber: device.phoneNumber,
        fullName: device.fullName,
      }
      dataArr.push(finalData)
    }

    setTableData(dataArr)
    setLoading(false)
  }

  useEffect(() => {
    if (phoneNumbers.length !== 0 && mobileDevices.length !== 0) {
      setLoading(true)
      if (!filter) {
        getDocuments(mobileDevices, hotspotNames)
      }
    }
  }, [phoneNumbers, mobileDevices, filter])

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

  // applying filter
  useEffect(async () => {
    setLoading(true)
    let hotspots = []
    if (selectedHotspotNames.length !== 0) {
      selectedHotspotNames.forEach((x) => {
        const temp = hotspotNames
        const filterArr = temp.filter((item) => item.hotspotName === x)
        hotspots.push(...filterArr)
      })
      setFilter(true)
    } else {
      hotspots = hotspotNames
      setFilter(false)
    }

    setSelectedHotspots(hotspots)
    let devices = []
    if (selectedDevices.length !== 0) {
      mobileDevices.forEach((d) => {
        selectedDevices.forEach((x, i) => {
          const number = x.split(' - ')[1]
          if (d.phoneNumber === number) {
            devices.push(d)
          }
        })
      })
      setFilter(true)
    } else {
      devices = mobileDevices
      setFilter(false)
    }

    if (selectedGroupNames.length === 0) {
      setFilter(false)
    }

    await getDocuments(devices, hotspots)
  }, [selectedDevices, selectedHotspotNames, selectedGroupNames, selectedMonth])

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
        {!loading ? (
          <ReportTable
            tableData={tableData}
            hotspotNames={
              selectedHotspotNames.length === 0
                ? hotspotNames
                : selectedHotspots
            }
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: '300px',
            }}
          >
            <CircularProgress color='inherit' />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AdminReport
