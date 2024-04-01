let cityDataNow = [];  // Array to hold current weather data from the async function current weather
let cityDataForecast = [];  //  Array to hold forecast weather data from the async function forecast weather
let favArr = []; //Array to store favorite cities (from local storage).

//DOM elements are retrieved using getElementById and querySelector for search bar, buttons, and weather display sections.
const searchBar = document.getElementById("searchBar");
const saveBtn = document.getElementById("saveBtn");
const displayName = document.getElementById("displayName");
const sprite = document.getElementById("sprite");
const deleteBtn = document.getElementById("deleteBtn");
const searchBtn = document.getElementById("searchBtn");

const apiKey = '9792acd73fd4b0e9811178d9ae85e37f';

const searchInput = document.querySelector(".inputfield input");
const favbtn = document.querySelector(".inputfield button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");

// Helper Functions for Dates and Time:
// Sets up an array for day names (days).
// Gets current date and time and displays them on the page.
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const d = new Date();
let day = days[d.getDay()];
document.getElementById("currentDate").innerHTML = day;

let date = new Date();
let current_time = date.getHours() + ":" + date.getMinutes();
document.getElementById("p1").innerHTML = current_time;

// Event listener for search bar (keypress) in the search bar to trigger getweatherData function with the entered city.
searchBar.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const chosenCity = searchBar.value;
    getweatherData(chosenCity);
  }
});

// Event listener for search input (onkeyup)
// If there's text entered, activates the "Save to Favorites" button.
searchInput.onkeyup = () => {
  let userEnteredValue = searchInput.value.trim();
  if (userEnteredValue) {
    favbtn.classList.add("active");
  } else {
    favbtn.classList.remove("active");
  }
};

// showTasks Function: Load tasks on page load
// Retrieves favorite cities from local storage and populates the favArr array.
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
// Updates the number of pending tasks (favorites) on the page.
function showTasks() {
  let getLocalStorageData = localStorage.getItem("New Todo");
  favArr = getLocalStorageData ? JSON.parse(getLocalStorageData) : [];
  const pendingTasksNumb = document.querySelector(".pendingTasks");
  pendingTasksNumb.textContent = favArr.length;

  // Creates a list (newLiTag) containing favorite cities as list items with a delete button (<i class="fas fa-trash"></i>).
  deleteAllBtn.classList.remove("active");
  if (favArr.length > 0) {
    deleteAllBtn.classList.add("active");
  }

  // Creates a list (newLiTag) containing favorite cities as list items with a delete button (<i class="fas fa-trash"></i>).
  let newLiTag = "";
  favArr.forEach((element, index) => {
    // Append task text to newLiTag with an onclick event to call weatherFunction()
    newLiTag += `<li onclick="runAllWeather('${element}')">${element}<span class="icon" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></span></li>`;
    console.log(element);
    console.log(index);
  });

// Updates the todo list (todoList) with the new list items and clears the search input field.
  todoList.innerHTML = newLiTag; //adding new li tag inside ul tag

// this function will change the input's value so that you can click the search button again to run with the updated city from the favorites offcanvas
  searchInput.value = ""; //once task added leave the input field blank
}

// runAllWeather Function (for Favorites)
// Fetches current and 5 day weather by clicking favorite city
async function runAllWeather(favArrElement) {
  cityInput.value = favArrElement;
  const currentWeatherData = await fetchCurrentWeather();
  displayCurrentWeather(currentWeatherData);

  const forecastData = await fetchForecast();
  const forecastDays = forecastData.list;
  const filteredForecast = filterData(forecastDays);
  displayForecast(filteredForecast);
}

// Delete task function
function deleteTask(index) {
  favArr.splice(index, 1); // Takes an index as input and removes the corresponding favorite city from the favArr array.
  localStorage.setItem("New Todo", JSON.stringify(favArr)); // Updates local storage and calls showTasks to refresh the list.
  showTasks();
}

// Delete all tasks function
// Clears the favArr array, updates local storage, and calls showTasks to refresh the list (removing all favorites).
deleteAllBtn.onclick = () => {
  favArr = [];
  localStorage.setItem("New Todo", JSON.stringify(favArr));
  showTasks();
};

// DOM elements for weather
// Retrieves DOM elements for city name input and location button.
let cityName = document.getElementById("cityInput");
const locationBtn = document.querySelector('#locationBtn');

// Function to fetch current weather data
async function fetchCurrentWeather() {
  cityName = cityInput.value; // Gets the city name from the search input field.
  // Constructs a URL to fetch current weather data from OpenWeatherMap API using the city name and API key.
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

// Fetches data using fetch and checks for errors.
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
// Takes weather data as input
// Uses string interpolation to create HTML content for displaying current weather information including city name, temperature, high/low, description, feels like, pressure, and an icon
function displayCurrentWeather(data) {
  document.querySelector('.current-weather-info').innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <h1>${Math.round(data.main.temp)}°</h1>
    <h6>HIgh ${data.main.temp_max}°</h6>
    <h6>Low ${data.main.temp_min}°</h6>
 
    <h6>${data.date}°</h6>
    <img id="current-weather-icon">
    <h4>${data.weather[0].description}</h4>  
    <h6>Feels like: ${data.main.feels_like}°F</h6>`
  // <h6>Pressure: ${data.pressure}</h6>
  // <h6>Humidity ${data.main.humidity}%</h6>

  // Setting the icon
  document.querySelector('#current-weather-icon').setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`);
}



// Function to fetch the forecast data for the entered city.
async function fetchForecast() {

  cityName = cityInput.value;
  url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  cityDataForecast = data; // Stores the fetched data in cityDataForecast and returns it
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
    // Uses string interpolation to create HTML content for displaying the day of the week, weather icon, and temperature.
    const forecastDiv = document.createElement('div');
    forecastDiv.classList.add('weather-card');
    forecastDiv.innerHTML = `
        <p>${dayOfWeek}</p>
        <img src ='https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png'>
        <p id= 'forecast-temp'><b>${Math.round(element.main.temp)}°</b></p>`;

    forecastContainer.appendChild(forecastDiv); // Appends the new forecast card to the container element.
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

// Event Listeners Assignments
searchBtn.addEventListener('click', displayAll);
locationBtn.addEventListener('click', getUserPosition);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

// Logging Statements: Logs the city name from current weather
console.log(cityDataNow.name);
console.log(cityDataForecast);