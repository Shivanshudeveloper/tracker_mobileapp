import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, CircularProgress, Backdrop } from '@mui/material'
import ReportTable from '../components/report/ReportTable'
import HotspotFilter from '../components/report/HotspotFilter'
import DeviceFilter from '../components/report/DeviceFilter'
import MonthFilter from '../components/report/MonthFilter'
import GroupFilter from '../components/report/GroupFilter'
import axios from 'axios'
import { API_SERVICE } from '../URI'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { useNavigate } from 'react-router'
import { useSubscription } from '../hooks/useSubscription'
import { getSubscriptionDetails } from '../utils/getSubscriptionDetails'
import HiddenReportTable from '../components/report/HiddenReportTable'

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
    const [tableData, setTableData] = useState([])

    const [selectedHotspotNames, setSelectedHotspotNames] = useState([])
    const [selectedGroups, setSelectedGroups] = useState([])
    const [selectedHotspots, setSelectedHotspots] = useState([])
    const [selectedDevices, setSelectedDevices] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(
        Months[new Date().getMonth()]
    )
    const [loading, setLoading] = useState(false)
    const [filteredData, setFilteredData] = useState([])

    // subscription state
    const [subscription, setSubscription] = useState(null)

    const userData = sessionStorage.getItem('userData')
        ? JSON.parse(sessionStorage.getItem('userData'))
        : null

    const devices = useSelector((state) => state.devices)
    const { deviceList } = devices

    const groups = useSelector((state) => state.groups)
    const { groupList } = groups
    const hotspots = useSelector((state) => state.hotspots)
    const { hotspotList } = hotspots

    const { state } = useSubscription()

    const navigate = useNavigate()

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken')

        if (!authToken) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        if (userData !== null) {
            setLoading(true)
            const fetchData = async () => {
                const { data } = await axios.get(
                    `${API_SERVICE}/get/attendance/${userData.uid}/${
                        Months.indexOf(selectedMonth) + 1
                    }`
                )

                console.log(data)
                setTableData(data)
                setLoading(false)
            }

            fetchData()
        }
    }, [selectedMonth])

    useEffect(() => {
        const fetchSubDetail = async () => {
            const details = await getSubscriptionDetails(state)
            setSubscription(details)
        }

        fetchSubDetail()
    }, [])

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
        setSelectedGroups(typeof value === 'string' ? value.split(',') : value)
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
                const temp = hotspotList
                const filterArr = temp.filter((item) => item._id === x)
                hotspots.push(...filterArr)
            })
        } else {
            hotspots = hotspotList
        }

        setSelectedHotspots(hotspots)
        let devices = []
        if (selectedDevices.length !== 0) {
            const temp = tableData
            selectedDevices.forEach((x, i) => {
                const number = x.split(' - ')[1]
                const filterArr = temp.filter(
                    (item) => item.phoneNumber === number
                )
                devices.push(...filterArr)
            })
        } else {
            devices = tableData
        }

        setFilteredData(devices)

        setLoading(false)
    }, [selectedDevices, selectedHotspotNames])

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
                    subscription={subscription}
                />

                <HotspotFilter
                    handleHotspotSelect={handleHotspotSelect}
                    selectedHotspotNames={selectedHotspotNames}
                    hotspotNames={hotspotList}
                />

                <GroupFilter
                    handleGroupSelect={handleGroupSelect}
                    selectedGroupNames={selectedGroups}
                    groupNames={groupList}
                />

                <DeviceFilter
                    handleSelectedDevice={handleSelectedDevice}
                    selectedDevices={selectedDevices}
                    mobileDevices={deviceList}
                />

                <Button variant='outlined' sx={{ p: 0 }}>
                    <ReactHTMLTableToExcel
                        id='test-table-xls-button'
                        table='table-to-xls'
                        filename='report'
                        sheet='tablexls'
                        className='export-btn'
                        buttonText='Export'
                    />
                </Button>
            </Box>

            <Box sx={{ my: 4 }}>
                {!loading ? (
                    <ReportTable
                        tableData={
                            selectedDevices.length === 0
                                ? tableData
                                : filteredData
                        }
                        id='table-to-xls'
                        hotspotList={hotspotList}
                        selectedHotspots={selectedHotspots}
                        selectedGroups={selectedGroups}
                        selectedMonth={Months.indexOf(selectedMonth)}
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
            <Box sx={{ my: 4 }}>
                {!loading ? (
                    <HiddenReportTable
                        tableData={
                            selectedDevices.length === 0
                                ? tableData
                                : filteredData
                        }
                        id='table-to-xls'
                        hotspotList={hotspotList}
                        selectedHotspots={selectedHotspots}
                        selectedGroups={selectedGroups}
                        selectedMonth={Months.indexOf(selectedMonth)}
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

export default Report
