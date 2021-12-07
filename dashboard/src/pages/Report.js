import React, { useEffect } from 'react'
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
} from '@material-ui/core'
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-bootstrap4'
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css'
import { Animation } from '@devexpress/dx-react-chart'
import { CSVLink } from 'react-csv'

import axios from 'axios'
import { API_SERVICE } from '../URI'

const Report = () => {
  const [age, setAge] = React.useState('')
  const [selectedDevice, setSelectedDevice] = React.useState('')
  const [mobileDeviceLocation, setMobileDeviceLocation] = React.useState([])
  const [chartData, setChartData] = React.useState([])
  const [excelData, setExcelData] = React.useState([])

  const forms = useSelector((state) => state.forms)
  const { userForms } = forms

  // dummy data
  const handleChange = (event) => {
    setAge(event.target.value)
  }

  // getting device loation
  const getMobileDeviceLocation = async (event) => {
    try {
      setSelectedDevice(event.target.value)
      const email = event.target.value
      const { data } = await axios.get(
        `${API_SERVICE}/api/v1/main/tracker/userLocation/${email}`
      )
      setMobileDeviceLocation(data)
    } catch (error) {
      console.log(error)
    }
  }

  // preparing chart data
  useEffect(() => {
    if (mobileDeviceLocation !== []) {
      const locationArray = mobileDeviceLocation.map((x) => {
        return x.hotspot
      })
      const occurrences = locationArray.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
      }, {})
      const data = []
      for (let [key, value] of Object.entries(occurrences)) {
        const pair = {
          name: key.slice(0, 40),
          count: value,
        }

        data.push(pair)
      }
      setChartData(data)
    }
  }, [mobileDeviceLocation])

  useEffect(() => {
    if (mobileDeviceLocation !== []) {
      const data = mobileDeviceLocation.map((x) => {
        return { DeviceName: x.fullName, hotspot: x.hotspot }
      })

      setExcelData(data)
    }
  }, [mobileDeviceLocation])

  const headers = [
    { label: 'Device Name', key: 'DeviceName' },
    { label: 'Hotspot', key: 'hotspot' },
  ]

  return (
    <Box sx={{ p: 2, pl: 3 }}>
      <Card sx={{ p: 1 }}>
        <Typography sx={{ p: 1 }} component='h1' variant='h4'>
          Filter By:
        </Typography>
        <Grid container>
          <Grid item xs={4}>
            <Stack direction='row' alignItems='center' justifyContent='center'>
              <Typography>Month</Typography>
              <FormControl variant='filled' sx={{ width: '250px', ml: 2 }}>
                <InputLabel>Month</InputLabel>
                <Select value={age} onChange={handleChange} label='Age'>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction='row' alignItems='center' justifyContent='center'>
              <Typography>Hotspots</Typography>
              <FormControl variant='filled' sx={{ width: '250px', ml: 2 }}>
                <InputLabel>Hotspots</InputLabel>
                <Select value={age} onChange={handleChange} label='Age'>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack direction='row' alignItems='center' justifyContent='center'>
              <Typography>Mobile Devices</Typography>
              <FormControl variant='filled' sx={{ width: '250px', ml: 2 }}>
                <InputLabel>Mobile Devices</InputLabel>
                <Select
                  value={selectedDevice}
                  onChange={getMobileDeviceLocation}
                  label='Mobile Devices'
                >
                  {userForms.map((x) => (
                    <MenuItem key={x._id} value={x.email}>
                      {x.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      {excelData.length !== 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', m: 2 }}>
          <Button variant='outlined'>
            <CSVLink data={excelData} headers={headers}>
              Export Data to Excel
            </CSVLink>
          </Button>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device Name</TableCell>
              <TableCell align='left'>Hotspot</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mobileDeviceLocation.map((x) => (
              <TableRow key={x._id}>
                <TableCell component='th' scope='row'>
                  {x.fullName}
                </TableCell>
                <TableCell align='left'>{x.hotspot}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {chartData !== [] && (
        <Box sx={{ mt: 4 }}>
          <div className='card'>
            <Chart data={chartData}>
              <ArgumentAxis />
              <ValueAxis />

              <BarSeries valueField='count' argumentField='name' />
              {mobileDeviceLocation.length !== 0 && (
                <Title text={mobileDeviceLocation[0].fullName} />
              )}
              <Animation />
            </Chart>
          </div>
        </Box>
      )}
    </Box>
  )
}

export default Report
