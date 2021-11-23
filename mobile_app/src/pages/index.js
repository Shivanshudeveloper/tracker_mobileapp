import axios from 'axios';
import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboard/budget';
import { DashboardLayout } from '../components/dashboard-layout';
import Head from 'next/head';
import { LatestOrders } from '../components/dashboard/latest-orders';
import { LatestProducts } from '../components/dashboard/latest-products';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Sales } from '../components/dashboard/sales';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { TrafficByDevice } from '../components/dashboard/traffic-by-device';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [location, setLocation] = useState([])

  useEffect(() => {

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      axios.get(`http://localhost:5000/api/v1/main/getlatlong/${crd.latitude}/${crd.longitude}`).then((res) => {
        const data = Object.entries(res.data)
        setLocation(data)

      })

      /*  let location = 'Your current position is :' + ` Latitude : ${crd.latitude}` + ` Longitude: ${crd.longitude}`
          + ` More or less ${crd.accuracy} meters.` */


    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, [])

  return (<>
    <Head>
      <title>
        Dashboard | Material Kit
      </title>
      <link rel="manifest" href="manifest.json" />

    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >

      <Container maxWidth={false}>


        <Box sx={{ bgcolor: 'background.paper' }}>
          <List>{location.map((item) => <ListItem>   <ListItemText justifyContent="center" primary={`${item[0]} : ${item[1]}`} />
          </ListItem>)
          }</List>
        </Box>

      </Container>
    </Box>
  </>
  )

}


Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
