import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';

import { getDatabase, ref, set } from "firebase/database";

import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";


export const AccountProfileDetails = (props) => {



  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  }

  initializeApp(firebaseConfig);

  const auth = getAuth();
  const User = auth.currentUser;

  const [values, setValues] = useState({
    displayName: 'Loading...',
    formattedAddress: 'Loading...',
    state: 'Loading...',
    country: 'Loading...',
    city: 'Loading...',
    zipcode: 'Loading...',
    countryCode: 'Loading...',
    neighbourhood: 'Loading...'
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      axios.get(`http://localhost:5000/api/v1/main/getlatlong/${crd.latitude}/${crd.longitude}`).then((res) => {

        setValues({ ...res.data, displayName: User.displayName })

      })

      /*  let location = 'Your current position is :' + ` Latitude : ${crd.latitude}` + ` Longitude: ${crd.longitude}`
          + ` More or less ${crd.accuracy} meters.` */
    }



    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

    const interval = setInterval(() => {
      navigator.geolocation.watchPosition(position => {
        const db = getDatabase();
        set(ref(db, 'trackerapp/testuser'), {
          lat: position.latitude,
          long: position.longitude
        });
      })
    }, 60000);

    return () => clearInterval(interval);
  }, [])

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="The information can't be edited"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Display name"
                name="displayName"
                required
                readOnly
                value={values.displayName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Country"
                name="country"
                readOnly
                required
                value={values.country}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="State"
                name="state"
                readOnly
                required
                value={values.state}
                variant="outlined"
              >

              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="City"
                name="city"
                readOnly
                required

                value={values.city}
                variant="outlined"
              >

              </TextField>
            </Grid>

            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Zip Code"
                name="zipcode"
                readOnly
                required
                value={values.zipcode}
                variant="outlined"
              >

              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Country code"
                name="countrycode"
                readOnly
                required

                value={values.countryCode}
                variant="outlined"
              >

              </TextField>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Address"

                name="address"
                readOnly
                required
                value={values.formattedAddress}
                variant="outlined"
              />
            </Grid>


            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="Neighbourhood"
                name="neighbourhood"
                readOnly
                required

                value={values.neighbourhood}
                variant="outlined"
              >

              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};
