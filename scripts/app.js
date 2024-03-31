let cityDataNow = [];  // will hold the data from the async function current weather
let cityDataForecast = [];  // will hold the data from the async function forecast weather
let favArr = [];

// Get required elements
const searchBar = document.getElementById("searchBar");
const saveBtn = document.getElementById("saveBtn");
const injectHere = document.getElementById("injectHere");

const displayName = document.getElementById("displayName");
const sprite = document.getElementById("sprite");
const deleteBtn = document.getElementById("deleteBtn");
const searchBtn = document.getElementById("searchBtn");

const apiKey = '9792acd73fd4b0e9811178d9ae85e37f';

// Search input and add button
const searchInput = document.querySelector(".inputfield input");
const favbtn = document.querySelector(".inputfield button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");

// Helper functions for days and time
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const d = new Date();
let day = days[d.getDay()];
document.getElementById("currentDate").innerHTML = day;

let date = new Date();
let current_time = date.getHours() + ":" + date.getMinutes();
document.getElementById("p1").innerHTML = current_time;

// Event listener for search bar (keypress)
searchBar.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const chosenCity = searchBar.value;
    getweatherData(chosenCity);
  }
});

// Event listener for search input (onkeyup)
searchInput.onkeyup = () => {
  let userEnteredValue = searchInput.value.trim();
  if (userEnteredValue) {
    favbtn.classList.add("active");
  } else {
    favbtn.classList.remove("active");
  }
};

// Load tasks on page load
showTasks();

// Add button click event listener
favbtn.onclick = () => {
  let userEnteredValue = searchInput.value.trim();
  let getLocalStorageData = localStorage.getItem("New Todo");
  favArr = getLocalStorageData ? JSON.parse(getLocalStorageData) : [];
  favArr.push(userEnteredValue);
  localStorage.setItem("New Todo", JSON.stringify(favArr));
  showTasks();
  favbtn.classList.remove("active");
  searchInput.value = "";
};

function showTasks() {
  let getLocalStorageData = localStorage.getItem("New Todo");
  favArr = getLocalStorageData ? JSON.parse(getLocalStorageData) : [];
  const pendingTasksNumb = document.querySelector(".pendingTasks");
  pendingTasksNumb.textContent = favArr.length;

  deleteAllBtn.classList.remove("active");
  if (favArr.length > 0) {
    deleteAllBtn.classList.add("active");
  }

  let newLiTag = "";
  favArr.forEach((element, index) => {
    // Append task text to newLiTag with an onclick event to call weatherFunction()
    newLiTag += `<li onclick="runAllWeather('${element}')">${element}<span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
    console.log(element);
    console.log(index);
  });

  todoList.innerHTML = newLiTag; //adding new li tag inside ul tag
  searchInput.value = ""; //once task added leave the input field blank
}

// this function will change the input's value so that you can click the search button again to run with the updated city from the favorites offcanvas
function runAllWeather(favArrElement){
  cityInput.value = favArrElement;
  
}


// Delete task function
function deleteTask(index) {
  favArr.splice(index, 1);
  localStorage.setItem("New Todo", JSON.stringify(favArr));
  showTasks();
}

// Delete all tasks function
deleteAllBtn.onclick = () => {
  favArr = [];
  localStorage.setItem("New Todo", JSON.stringify(favArr));
  showTasks();
};

// DOM elements for weather
let cityName = document.getElementById("cityInput");
const locationBtn = document.querySelector('#locationBtn');

// Function to fetch current weather data
async function fetchCurrentWeather() {
  cityName = cityInput.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    alert('Please enter a valid city name.');
    return;
  }
  const data = await response.json();
  cityDataNow = data;
  return data;
}

// Function to display current weather
function displayCurrentWeather(data) {
  document.querySelector('.current-weather-info').innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <h1>${Math.round(data.main.temp)}°</h1>
    <h6>HIgh ${data.main.temp_max}°</h6>
    <h6>Low ${data.main.temp_min}°</h6>
 
    <h6>${data.date}°</h6>
    <img id="current-weather-icon">
    <h4>${data.weather[0].description}</h4>    
    <h6>Feels like: ${data.main.feels_like}°F</h6>
    <h6>Pressure: ${data.pressure}</h6>`
  // <h6>Humidity ${data.main.humidity}%</h6>

  // Setting the icon
  document.querySelector('#current-weather-icon').setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`);
}



// Function to fetch the forecast
async function fetchForecast() {

  cityName = cityInput.value;
  url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  cityDataForecast = data;
  return data;
}

// Function to display the forecast
function displayForecast(data) {

  const forecastContainer = document.querySelector('.forecast-container');

  // Clear existing forecast cards
  forecastContainer.innerHTML = '';

  // Iterating through the elements of the array
  data.forEach(element => {

    // Creating a Date obj out of the date text in order to display the day of the week
    const date = new Date(element.dt_txt);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);

    // Creating a new div for each day and displaying the data
    const forecastDiv = document.createElement('div');
    forecastDiv.classList.add('weather-card');
    forecastDiv.innerHTML = `
        <p>${dayOfWeek}</p>
        <img src ='https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png'>
        <p id= 'forecast-temp'><b>${Math.round(element.main.temp)}°</b></p>`;

    forecastContainer.appendChild(forecastDiv);
  });
}

// Function to filter an array of weather data in order to get only the temperature for the next following days at 15:00
function filterData(array) {
  return array.filter(element => {
    const hour = new Date(element.dt_txt).getHours();
    return hour === 15;
  })
}

// Function to display everything
async function displayAll(e) {
  // Preventing the default behaviour of the form
  e.preventDefault();

  // Fetching & displaying the current data
  const currentWeatherData = await fetchCurrentWeather();
  displayCurrentWeather(currentWeatherData);

  // Fetching, filtering & displaying the forecast
  const forecastData = await fetchForecast();
  const forecastDays = forecastData.list;
  const filteredForecast = filterData(forecastDays);
  displayForecast(filteredForecast);
}


// Geolocation API, Getting  the user's position
function getUserPosition(e) {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition(async position => {
    // Getting the user's coordinates
    const userLat = position.coords.latitude;
    const userLong = position.coords.longitude;

    // Fetching current weather based on the user's lat & long
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLong}&units=imperial&appid=${apiKey}`);
    const data = await response.json();
    displayCurrentWeather(data);

    // Fetching forecast based on the user's lat & long
    const fresponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${userLat}&lon=${userLong}&units=imperial&appid=${apiKey}`);
    const fdata = await fresponse.json();
    const forecastDays = fdata.list;
    const filteredForecast = filterData(forecastDays);
    displayForecast(filteredForecast);

  });
  
}

// Adding Event Listeners
searchBtn.addEventListener('click', displayAll);
locationBtn.addEventListener('click', getUserPosition);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());



console.log(cityDataNow.name);
console.log(cityDataForecast);