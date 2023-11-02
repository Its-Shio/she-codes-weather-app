let daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let dateText = document.querySelector("#dateTime");
let date = new Date();
let dayOfWeek = daysOfWeek[date.getDay()];
let time =
  date.getHours() +
  ":" +
  (date.getMinutes() < 10 ? "0" : "") +
  date.getMinutes();
dateText.innerHTML = dayOfWeek + " " + time + ", ";

let CFCounter = 1; //Sets the counter used to determine current temperature units

function searchCity(response) {
  let citySelected = document.querySelector("#cityName");
  citySelected.innerHTML =
    response.data.name + ", " + response.data.sys.country;

  let weatherDesc = document.querySelector("#weatherType");
  let tempDesc = response.data.weather[0].description;
  tempDesc = tempDesc
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" "); //Descriptions with multiple words are split into an array of segments, each segment's first letter is capitalized, and then the segments are sewn back together
  weatherDesc.innerHTML = tempDesc;

  let humidityDesc = document.querySelector("#humidityText");
  humidityDesc.innerHTML = response.data.main.humidity + "%";
  let windSpeedDesc = document.querySelector("#windText");
  let windNum = response.data.wind.speed;
  let windUnits;
  if (CFCounter) {
    windUnits = "km/h";
    windSpeedDesc.innerHTML = windNum + windUnits;
  } else {
    windUnits = "mph";
    windNum = Math.round((windNum / 1.609) * 100) / 100;
    windSpeedDesc.innerHTML = windNum + windUnits;
  }
  //windSpeedDesc.innerHTML = response.data.wind.speed + windUnits;

  let setTemp = document.querySelector("#tempNum");

  if (!CFCounter) {
    setTemp.innerHTML = Math.round(response.data.main.temp * (9 / 5) + 32);
  } else {
    setTemp.innerHTML = Math.round(response.data.main.temp);
  } //Sets the temp of the new city to either Fahrenheit or Celsius depending on the last temperature selected.
}
function setCurrent(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(searchCity);
}

function onSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#cityInput");
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(searchCity);
}
function clickCurrent() {
  navigator.geolocation.getCurrentPosition(setCurrent);
}

function convertTempF() {
  if (CFCounter) {
    //This ensures that you can't convert Celsius to Celsius, or Fahrenheit to Fahrenheit.
    let tempC = document.querySelector("#tempNum");
    let tempCInt = parseInt(tempC.innerHTML);
    let tempF = Math.round(tempCInt * (9 / 5) + 32);
    tempC.innerHTML = tempF;
    CFCounter--;
  }
}
function convertTempC() {
  if (!CFCounter) {
    let tempF = document.querySelector("#tempNum");
    let tempFInt = parseInt(tempF.innerHTML);
    let tempC = Math.round(((tempFInt - 32) * 5) / 9);
    tempF.innerHTML = tempC;
    CFCounter++;
  }
}

let searchButton = document.querySelector("#btnSubmit");
searchButton.addEventListener("click", onSearch);

let currentButton = document.querySelector("#btnCurrent");
currentButton.addEventListener("click", clickCurrent);

let cLink = document.querySelector("#celsius");
cLink.addEventListener("click", convertTempC);
let fLink = document.querySelector("#fahrenheit");
fLink.addEventListener("click", convertTempF);

let apiKey = "ebef9ca4a8de66ed586fac628fade056";

clickCurrent();
