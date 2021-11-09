import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';


const Locationview = () => {

  const [viewport, setViewport] = useState({
    width: '100%',
    height: 500,
    latitude: 28.613939,
    longitude: 77.209023,
    zoom: 10
  });
  const [selectedPark, setSelectedPark] = useState(null);
  

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
        <h2 style={{ marginBottom: '10px' }}>
          Shivanshu Gupta
        </h2>
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw"
          mapStyle="mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63"
          onViewportChange={nextViewport => setViewport(nextViewport)}
        >
          <Marker
            key="India Gate1"
            latitude={28.612911}
            longitude={77.229507}
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
            latitude={28.612911}
            longitude={77.229507}
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
      </Container>
    </Box>
  </>
  )
};

export default Locationview;
