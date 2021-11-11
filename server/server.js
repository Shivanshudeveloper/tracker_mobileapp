let nodeGeocoder = require('node-geocoder');
 
let options = {
  provider: 'openstreetmap'
};
 
let geoCoder = nodeGeocoder(options);
// Reverse Geocode



geoCoder.reverse({lat:28.568911, lon:77.162560})
  .then((res)=> {
    console.log(res);
  })
  .catch((err)=> {
    console.log(err);
  });