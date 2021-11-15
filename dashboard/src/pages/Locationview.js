import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { makeStyles } from '@material-ui/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { database } from '../Firebase/index';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import date from 'date-and-time';

import { API_SERVICE } from '../URI';

const now = new Date();

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const Locationview = () => {
  const classes = useStyles();
  const [lat, setlat] = useState(28.568911);
  const [long, setlong] = useState(77.162560);



  const [viewport, setViewport] = useState({
    width: '100%',
    height: 500,
    latitude: lat,
    longitude: long,
    zoom: 15
  });

  const [selectedPark, setSelectedPark] = useState(null);
  const [userlocationdata, setuserlocationdata] = useState({});

  const getLongLat = (lat, long) => {
    axios
        .get(
          `${API_SERVICE}/api/v1/main/getlatlong/${lat}/${long}`
        )
        .then((response) => {
          console.log(response.data);
          setuserlocationdata(response.data);
        })
        .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    var starCountRef = database.ref('trackerapp/testuser');
    starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
      // setalldata([data.work]);
      setViewport({
        width: '100%',
        height: 500,
        latitude: data.lat,
        longitude: data.long,
        zoom: 15
      });
      setlat(data.lat);
      setlong(data.long);
      getLongLat(data.lat, data.long);
    });
  }, []);



  

  

  return (
  <>
    <Helmet>
      <title>Dashboard</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        

        <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            S
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Shivanshu Gupta"
        subheader=""
      />



        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw"
          mapStyle="mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63"
          onViewportChange={nextViewport => setViewport(nextViewport)}
        >
          <Marker
            key="India Gate1"
            latitude={lat}
            longitude={long}
          >
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedPark("W");
              }}
            >
              <img alt="Image" src="https://img.icons8.com/color/48/000000/map-pin.png"/>
            </button>
          </Marker>

          {selectedPark ? (
          <Popup
            latitude={lat}
            longitude={long}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div>
              <h2>Shivanshu Location</h2>
              <p>
                Shivanshu is near the India Gate
              </p>
            </div>
          </Popup>
        ) : null}


        </ReactMapGL>

        <TableContainer sx={{ mt: 2 }} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell align="center">Country</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Street Name</TableCell>
                <TableCell align="center">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow key={1}>
                  <TableCell component="th" scope="row">
                    Shivanshu Gupta
                  </TableCell>
                  <TableCell align="center">{userlocationdata.country}</TableCell>
                  <TableCell align="center">{userlocationdata.formattedAddress}</TableCell>
                  <TableCell align="center">{userlocationdata.neighbourhood}</TableCell>
                  <TableCell align="center">{date.format(now, 'ddd, MMM DD YYYY')}</TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  </>
  )
};

export default Locationview;
