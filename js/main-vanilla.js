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

const setImage = (node, src, altTag) => {
  document.querySelector(node).src = src;
  document.querySelector(node).alt = altTag;
}

const formatTemp = x => Number.parseFloat(x).toFixed(1);

const updateTempDashboard = (city, country, temp, desc, icon) => {
  document.querySelector('#loading').remove();
  setNodeContents('.city', city);
  setNodeContents('.country', `, ${country}`);
  setNodeContents('.temp', `${temp} ºC`);
  setNodeContents('.desc', desc);
  setImage('.icon', icon, desc);
}

const getCelsius = tempKelvin => formatTemp(tempKelvin - 273);

const getFahrenheit = tempKelvin => formatTemp(1.8 * (tempKelvin - 273) + 32);

const handleToggleTemp = () => {
  let temp = isCelsius ? `${tempF} °F` : `${tempC} °C`;
  setNodeContents('.temp', temp);
  isCelsius = !isCelsius;
}

const handleWeather = (data) => {
  const obj = JSON.parse(data);
  city = obj.name;
  country = obj.sys.country;
  tempKelvin = obj.main.temp;
  tempF = getFahrenheit(tempKelvin);
  tempC = getCelsius(tempKelvin);
  tempDescription = obj.weather[0].main;
  icon = getIconUrl(obj.weather[0].icon);
  
  document.querySelector('.temp').addEventListener('click', handleToggleTemp);

  updateTempDashboard(city, country, tempC, tempDescription, icon);
}

// check for Geolocation support
if (navigator.geolocation) {
  // refactor this to ask the user if it's ok to get the geolocation
  window.onload = () => {

    navigator.geolocation.getCurrentPosition(geoSuccess);

  };

} else { 
  alert('Geolocation is not supported for this Browser/OS.'); 
}
