let startPos;
let lat;
let lon;
let isCelsius = true;
let city;
let country;
let tempKelvin;
let tempF;
let tempC;
let tempDescription;
let icon;
const getApiUrl = (lat, lon) => 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=98213889a026966c20b230d9f338821f';
const getIconUrl = code => `http://openweathermap.org/img/w/${code}.png`;

const geoSuccess = positon => {
  console.log(position);
  startPos = position;
  lat = startPos.coords.latitude;
  lon = startPos.coords.longitude;

  // call the api and fetch data
  $.get(getApiUrl(lat, lon), (data) => {
    console.log(data);
  });
};

// check for Geolocation support
if (navigator.geolocation) {
  // refactor this to ask the user if it's ok to get the geolocation
  window.onload = () => {

    navigator.geolocation.getCurrentPosition(geoSuccess);

  };

} else {
  alert('Geolocation is not supported for this Browser/OS.');
}
