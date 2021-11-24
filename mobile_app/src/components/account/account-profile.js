import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';


export const AccountProfile = (props) => {

  const [user, setUser] = useState({
    avatar: '/static/images/avatars/avatar_6.png',
    city: 'Loading...',
    country: 'Loading...',
    // jobTitle: 'Senior Developer',
    name: 'Loading....',
    //timezone: 'GTM-7'
  })




  useEffect(() => {

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      axios.get(`http://localhost:5000/api/v1/main/getlatlong/${crd.latitude}/${crd.longitude}`).then((res) => {

        setUser({ ...res.data, name: window.sessionStorage.getItem('userName') })

      })

      /*  let location = 'Your current position is :' + ` Latitude : ${crd.latitude}` + ` Longitude: ${crd.longitude}`
          + ` More or less ${crd.accuracy} meters.` */

    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, [])

  return (<><Card {...props}>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 64,
            mb: 2,
            width: 64
          }}
        />
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {`${user.city} ${user.country}`}
        </Typography>

      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button
        color="primary"
        fullWidth
        variant="text"
      >
        Upload picture
      </Button>
    </CardActions>
  </Card>
  </>
  )
};
