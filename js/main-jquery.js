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
  console.log(position);
  startPos = position;
  lat = startPos.coords.latitude;
  lon = startPos.coords.longitude;

  // call the api and fetch data
  makeGetRequest(getApiUrl(lat, lon), handleWeather);
};

const makeGetRequest = (url, callback) => {
  $.get(url, callback);
};

const handleWeather = data => {
  city = data.name;
  country = data.sys.country;
  tempKelvin = data.main.temp;
  tempF = getFahrenheit(tempKelvin);
  tempC = getCelsius(tempKelvin);
  tempDescription = data.weather[0].main;
  icon = getIconUrl(data.weather[0].icon);

  $('.temp').on('click', handleToggleTemp);
  updateTempDashboard(city, country, tempC, tempDescription, icon);
};

const getCelsius = tempKelvin => formatTemp(tempKelvin - 273);
const getFahrenheit = tempKelvin => formatTemp(1.8 * (tempKelvin - 273) + 32);
const formatTemp = x => Number.parseFloat(x).toFixed(1);

const updateTempDashboard = (city, country, temp, desc, icon) => {
  $('#loading').remove();
  setNodeContents('.city', city);
  setNodeContents('.country', `, ${country}`);
  setNodeContents('.temp', `${temp} ºC`);
  setNodeContents('.desc', desc);
  setImage('.icon', icon, desc);
}

const setNodeContents = (node, content) => {
  $(node).text(content);
}

const setImage = (node, src, altTag) => {
  $(node).attr('src', src);
  $(node).attr('alt', altTag);
}

const handleToggleTemp = () => {
  if (isCelsius) {
    setNodeContents('.temp', tempF + ' ºF');
  } else {
    setNodeContents('.temp', tempC + ' ºC');
  }
  isCelsius = !isCelsius;
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
