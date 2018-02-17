let startPos;
let lat;
let lon;
let isCelsius = true;
let city;
let tempKelvin;
let tempF;
let tempC;
let tempDescription;
const getApiUrl = (lat, lon) => 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=98213889a026966c20b230d9f338821f';

const geoSuccess = position => {

  startPos = position;
  lat = startPos.coords.latitude;
  lon = startPos.coords.longitude;

  // call the api and fetch the weather
  makeRequest('GET', getApiUrl(lat, lon), handleWeather);
};

const makeRequest = (type, url, callback) => {
  const req = new XMLHttpRequest();
  let response = '';

  req.open(type, url, true);

  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {

      callback(req.responseText);

    }
  }
  req.send(null);
};

const setNodeContents = (node, content) => {
  document.querySelector(node).innerHTML = content;
}

const formatTemp = x => Number.parseFloat(x).toFixed(2);

const updateTempDashboard = (city, temp, desc) => {
  document.querySelector('#loading').remove();
  setNodeContents('.city', city);
  setNodeContents('.temp', temp + ' ºC');
  setNodeContents('.desc', desc);
}

const getCelsius = tempKelvin => formatTemp(tempKelvin - 273);

const getFahrenheit = tempKelvin => formatTemp(1.8 * (tempKelvin - 273) + 32);

const handleWeather = (data) => {
  // console.log(data);
  const obj = JSON.parse(data);
  city = obj.name;
  tempKelvin = obj.main.temp;
  tempF = getFahrenheit(tempKelvin);
  tempC = getCelsius(tempKelvin);
  tempDescription = obj.weather[0].main;

  updateTempDashboard(city, tempC, tempDescription)

}

// check for Geolocation support
if (navigator.geolocation) {
  // refactor this to ask the user if it's ok to get the geolocation
  window.onload = () => {

    navigator.geolocation.getCurrentPosition(geoSuccess);

  };

} else { alert('Geolocation is not supported for this Browser/OS.'); }
