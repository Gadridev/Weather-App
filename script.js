const DefaultCity = "Rabat";
const cityNameEl = document.querySelector(".location");
const dateEl = document.querySelector(".date");
const tempEl = document.querySelector(".temp");
const statusEl = document.querySelector(".status");
const rangeEl = document.querySelector(".range");
const searchInput = document.getElementById("search-input");
const iconEl = document.getElementById("weather-icon");
const weatherTypeEl = document.querySelector(".weather-type");
const sunsetEl = document.querySelector(".sunset-1");
const sunriseEl = document.querySelector(".sunrise-1");
const rain = document.querySelector(".raining");
const visible = document.querySelector(".visible");
const windText = document.querySelector(".wind-text");
const humidityText = document.querySelector(".humidity-text");
const feel = document.getElementById("feel");
// function fetchWeather(city) {
//   const apiKey = "75a149379787553b92a652b56de63c16";
//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => fetchWeatherByCoords(data))
//     .then((data) => updateWeatherUI(data))
//     .catch((error) => console.error("Error fetching weather data:", error));
// }
// function fetchWeatherByCoords(data) {
//   updateWeatherUI(data);
//   const lat = data.coord.lat;
//   const lon = data.coord.lon;
//   const apiKey = "75a149379787553b92a652b56de63c16";
//   const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}`;
//   fetch by coordinates next 7 days weather;
//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => updateforcastUI(data))
//     .catch((error) => console.error("Error fetching weather data:", error));
// }
const toggleBtn = document.getElementById("theme-toggle");
const icon = toggleBtn.querySelector("i");

// Load user's theme from localStorage
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  icon.classList.replace("fa-moon", "fa-sun");
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  const isLight = document.body.classList.contains("light");
  console.log(isLight);
  // Change icon
  if (isLight) {
    icon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "light");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "dark");
  }
});
const cities = [
  { name: "Paris", country: "France" },
  { name: "rabat", country: "morroco" },
  { name: "Berlin", country: "Germany" },
  { name: "Tokyo", country: "Japan" },
];
async function fetchCurrentWeather(city) {
  const apiKey = "75a149379787553b92a652b56de63c16";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    alert("City not found");
  }
  const data = await response.json();
  return data;
}
//Get Current Location
function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
async function getUserCoordinates() {
  try {
    const position = await getLocation();
    const { latitude, longitude } = position.coords;

    return { latitude, longitude };
  } catch (error) {
    console.error("Location error:", error);
  }
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

async function fetch7DayForecast(lat, lon) {
  const apiKey = "75a149379787553b92a652b56de63c16";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Forecast data not found");
  }
  const data = await response.json();
  return data;
}
async function fetchDifferentCities() {
  for (let city of cities) {
    const apiKey = "75a149379787553b92a652b56de63c16";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    const child = document.createElement("div");
    child.classList.add("city-card");
    child.innerHTML = ` <div class="city-card">
                <div class="city">
                  <span>${data.name}</span>
                  <h1>${Math.round(data.main.temp)}°C</h1>
                </div>
                <img
                      src=https://openweathermap.org/img/wn/${
                        data.weather[0].icon
                      }@4x.png
                      alt="thunderstorm"
                      width="130px"
                    />
              </div>`;
    document.querySelector(".city-grid").appendChild(child);
    console.log(data);
  }
}
fetchDifferentCities();
async function updateWeather(city) {
  try {
    const currentWeatherData = await fetchCurrentWeather(city);
    const lat = currentWeatherData.coord.lat;
    const lon = currentWeatherData.coord.lon;
    const forecastData = await fetch7DayForecast(lat, lon);
    updateWeatherUI(currentWeatherData);
    updateforcastUI(forecastData);
    console.log(forecastData.list[0]);
    const chanceOfRain = forecastData.list[0].pop;
    const visisbility = forecastData.list[0].visibility;
    const visibilityKm = (visisbility / 1000).toFixed(1);
    console.log(visibilityKm);
    const wind = currentWeatherData.wind.speed;
    const humidity = currentWeatherData.main.humidity;
    console.log(humidity, wind);
    UpdateStatisticsUI(chanceOfRain, humidity, wind, visibilityKm);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
async function getCurrentLocationWeather(lat, lon) {
  const apiKey = "75a149379787553b92a652b56de63c16";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
function showLoaderForShortTime() {
  const loader = document.querySelector(".loader");

  loader.classList.remove("hidden");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 800); // hide after 0.8 seconds
}

function updateWeatherUI(data) {
  console.log(data);
  if (data.cod !== 200) {
    alert("City not found!");
    return;
  }

  cityNameEl.textContent = data.name;
  const date = new Date();
  dateEl.textContent = date.toDateString();
  console.log(date);
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  weatherTypeEl.textContent = data.weather[0].description;
  rangeEl.textContent = `Min: ${Math.round(
    data.main.temp_min
  )}°C / Max: ${Math.round(data.main.temp_max)}°C`;
  const iconCode = data.weather[0].icon;
  console.log(iconCode);
  iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  const sunriseTime = convertTime(data.sys.sunrise);
  const sunsetTime = convertTime(data.sys.sunset);
  sunriseEl.textContent = sunriseTime;
  sunsetEl.textContent = sunsetTime;
  feel.textContent = `${Math.round(data.main.feels_like)}°C`;
  const lengthInSeconds = data.sys.sunset - data.sys.sunrise;
  const hours = Math.floor(lengthInSeconds / 3600);
  const minutes = Math.floor((lengthInSeconds % 3600) / 60);
  const dayLength = `${hours}h ${minutes}m`;
  
  document.querySelector(".day-length").textContent = dayLength;
}
function timeConverter(timestamp) {
  //convert timing from dt: 1765292400 to hours
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return hours;
}
timeConverter(1765292400);
function updateforcastUI(data) {
  console.log(data);
  //<div class="hour-card">1PM <br/> <img
  //       src="https://openweathermap.org/img/wn/11d@2x.png"
  //       alt="thunderstorm"
  //     />20°
  // </div>
  const forecastContainer = document.querySelector(".hours");
  forecastContainer.innerHTML = "";
  data.list.forEach((forecast) => {
    const hour = timeConverter(forecast.dt);
    const iconCode = forecast.weather[0].icon;
    console.log(forecast.main);
    const temp = Math.round(forecast.main.temp);
    const hourCard = document.createElement("div");
    hourCard.classList.add("hour-card");

    hourCard.innerHTML = `
        ${hour}:00 <br/><img
                      src=https://openweathermap.org/img/wn/${iconCode}@4x.png
                      alt="thunderstorm"
                    />
                    ${temp}°  `;
    // console.log(hourCard);;
    forecastContainer.appendChild(hourCard);
  });
}
// Event listener for search input
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) {
      updateWeather(city);
      searchInput.value = "";
    }
  }
});
async function main() {
  let coords = null;

  try {
    coords = await getUserCoordinates();
  } catch (e) {
    console.log("User denied location.");
  }

  let dataCurrent;

  if (coords) {
    const { latitude, longitude } = coords;
    dataCurrent = await getCurrentLocationWeather(latitude, longitude);
  }

  if (!coords || !dataCurrent) {
    updateWeather("Rabat");
    return;
  }
  updateWeather(dataCurrent.name);
}

main();
function convertTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
function UpdateStatisticsUI(pop, humidity, windSpeed, visibility) {
  console.log(pop, visibility);
  //chance of rain
  rain.textContent = `${pop} %`;
  //humidity
  humidityText.textContent = humidity;
  //wind speed
  windText.textContent = windSpeed;
  //Uv index
  visible.textContent = `${visibility} km`;
}
document.body.classList.contains