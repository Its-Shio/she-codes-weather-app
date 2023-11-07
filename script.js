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
  citySelected.innerHTML = response.data.city + ", " + response.data.country;

  let weatherDesc = document.querySelector("#weatherType");
  let tempDesc = response.data.condition.description;
  tempDesc = tempDesc
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" "); //Descriptions with multiple words are split into an array of segments, each segment's first letter is capitalized, and then the segments are sewn back together
  weatherDesc.innerHTML = tempDesc;

  let humidityDesc = document.querySelector("#humidityText");
  humidityDesc.innerHTML = response.data.temperature.humidity + "%";
  let windSpeedDesc = document.querySelector("#windText");
  let windSpeedUnits = document.querySelector("#windUnits");
  let windNum = response.data.wind.speed;
  let windUnits;
  if (CFCounter) {
    windUnits = "km/h";
    windSpeedDesc.innerHTML = Math.round(windNum * 10) / 10;
    windSpeedUnits.innerHTML = windUnits;
  } else {
    windUnits = "mph";
    windNum = Math.round((windNum / 1.60934) * 10) / 10;
    windSpeedDesc.innerHTML = windNum;
    windSpeedUnits.innerHTML = windUnits;
  }

  let image = document.querySelector("#icon");
  image.innerHTML = `<img src = "http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png"/>`;

  let setTemp = document.querySelector("#tempNum");

  if (!CFCounter) {
    setTemp.innerHTML = Math.round(
      response.data.temperature.current * (9 / 5) + 32
    );
  } else {
    setTemp.innerHTML = Math.round(response.data.temperature.current);
  } //Sets the temp of the new city to either Fahrenheit or Celsius depending on the last temperature selected.
  getForecast(response.data.city);
}
function setCurrent(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}`;
  axios.get(apiUrl).then(searchCity);
}

function onSearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#cityInput");
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityInput.value}&units=metric`;
  axios.get(`${apiUrl}&key=${apiKey}`).then(searchCity);
}
function clickCurrent() {
  navigator.geolocation.getCurrentPosition(setCurrent);
}

function convertImperial() {
  if (CFCounter) {
    //This ensures that you can't convert Celsius to Celsius, or Fahrenheit to Fahrenheit.
    let tempC = document.querySelector("#tempNum");
    let tempCInt = parseInt(tempC.innerHTML);
    let tempF = Math.round(tempCInt * (9 / 5) + 32);
    tempC.innerHTML = tempF;

    let windKm = document.querySelector("#windText");
    let windKmInt = parseFloat(windKm.innerHTML);
    let windMiles = Math.round((windKmInt / 1.60934) * 10) / 10;
    let windUnitsKm = document.querySelector("#windUnits");
    let windUnitsMi = "mph";
    windKm.innerHTML = windMiles;
    windUnitsKm.innerHTML = windUnitsMi;

    CFCounter--;
  }
}
function convertMetric() {
  if (!CFCounter) {
    let tempF = document.querySelector("#tempNum");
    let tempFInt = parseInt(tempF.innerHTML);
    let tempC = Math.round(((tempFInt - 32) * 5) / 9);
    tempF.innerHTML = tempC;

    let windMiles = document.querySelector("#windText");
    let windMiInt = parseFloat(windMiles.innerHTML);
    let windKm = Math.round(windMiInt * 1.60934 * 10) / 10;
    let windUnitsMi = document.querySelector("#windUnits");
    let windUnitsKm = "km/h";
    windMiles.innerHTML = windKm;
    windUnitsMi.innerHTML = windUnitsKm;

    CFCounter++;
  }
}

function getForecast(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}
function displayForecast(response) {
  let forecastElement = document.querySelector("#weatherForecast");
  let days = ["Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastHtml = "";
  days.forEach(function (day) {
    forecastHtml =
      forecastHtml +
      `<div class="forecastDay">
            ${day} <img src="images/partly_cloudy.png" />
            <span class="forecastTemp">10° 10°</span>
          </div>`;
  });
  forecastElement.innerHTML = forecastHtml;
}

let searchButton = document.querySelector("#btnSubmit");
searchButton.addEventListener("click", onSearch);

let currentButton = document.querySelector("#btnCurrent");
currentButton.addEventListener("click", clickCurrent);

let cLink = document.querySelector("#celsius");
cLink.addEventListener("click", convertMetric);
let fLink = document.querySelector("#fahrenheit");
fLink.addEventListener("click", convertImperial);

let apiKey = "de0e2db99e807aaf2e3te4ed847cc3o3";

clickCurrent();
