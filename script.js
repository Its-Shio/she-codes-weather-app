/*let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};*/

let daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let temp = document.querySelector("#tempNum");
let CFCounter = 1;

function searchCity(response) {
  let citySelected = document.querySelector("#cityName");
  citySelected.innerHTML =
    response.data.name + ", " + response.data.sys.country;

  let tempC = document.querySelector("#tempNum");

  if (!CFCounter) {
    tempC.innerHTML = Math.round(response.data.main.temp * (9 / 5) + 32);
  } else {
    tempC.innerHTML = Math.round(response.data.main.temp);
  } //Sets the temp of the new city to either Fahrenheit or Celsius depending on the last temperature selected.
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

function setCurrent(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(searchCity);
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

let dateText = document.querySelector("#dateTime");
let date = new Date();
let dayOfWeek = daysOfWeek[date.getDay()];
let time =
  date.getHours() +
  ":" +
  (date.getMinutes() < 10 ? "0" : "") +
  date.getMinutes();
dateText.innerHTML = dayOfWeek + " " + time;

let searchButton = document.querySelector("#btnSubmit");
searchButton.addEventListener("click", onSearch);

let currentButton = document.querySelector("#btnCurrent");
currentButton.addEventListener("click", clickCurrent);

let cLink = document.querySelector("#celsius");
cLink.addEventListener("click", convertTempC);
let fLink = document.querySelector("#fahrenheit");
fLink.addEventListener("click", convertTempF);

let apiKey = "ebef9ca4a8de66ed586fac628fade056";

clickCurrent(); //Sets the location to the user's current location upon loading the page

/*let cityName = prompt("Enter a city.");
cityName = cityName.toLowerCase();

if (weather[cityName] !== undefined) {
  let tempC = weather[cityName].temp;
  let tempF = Math.round(tempC * (9 / 5) + 32);
  tempC = Math.round(tempC);
  let hum = weather[cityName].humidity;

  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  alert(
    `It is currently ${tempC}°C (${tempF}°F) in ${cityName} with a humidity of ${hum}%.`
  );
} else {
  alert(
    `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${cityName}`
  );
}*/
