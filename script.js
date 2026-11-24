// the two cities
const brampton = { name: 'Brampton', lat: 43.73, lon: -79.76 };
const toronto = { name: 'Toronto', lat: 43.65, lon: -79.38 };

// the city we are showing right now
let currentCity = brampton;

// the things on the page
const bramptonButton = document.getElementById('brampton-button');
const torontoButton = document.getElementById('toronto-button');
const refreshButton = document.getElementById('refresh-button');

// function: turn the weather code from the API into words and a picture
function describeWeather(code) {
  if (code === 0) {
    return { words: 'Clear sky', image: 'images/clear.jpg' };
  } else if (code === 1) {
    return { words: 'Mostly clear', image: 'images/clear.jpg' };
  } else if (code === 2) {
    return { words: 'Partly cloudy', image: 'images/cloudy.jpg' };
  } else if (code === 3) {
    return { words: 'Cloudy', image: 'images/cloudy.jpg' };
  } else if (code === 45 || code === 48) {
    return { words: 'Foggy', image: 'images/cloudy.jpg' };
  } else if (code >= 71 && code <= 77 || code === 85 || code === 86) {
    return { words: 'Snowy', image: 'images/snow.jpg' };
  } else {
    // drizzle, rain, showers and storms
    return { words: 'Rainy', image: 'images/rain.jpg' };
  }
}

// function: get the weather from the API
async function getWeather() {
  document.getElementById('city-name').textContent = currentCity.name;
  document.getElementById('error').textContent = '';

  // show which city button is chosen
  bramptonButton.classList.toggle('chosen', currentCity === brampton);
  torontoButton.classList.toggle('chosen', currentCity === toronto);

  const apiURL =
    'https://api.open-meteo.com/v1/forecast?latitude=' + currentCity.lat +
    '&longitude=' + currentCity.lon +
    '&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto';

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    console.log(data);
    showWeather(data);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('error').textContent =
      'Could not load the weather. Check your internet and try again.';
  }
}

// function: use the data to change the page
function showWeather(data) {
  const temperature = data.current.temperature_2m;
  const feelsLike = data.current.apparent_temperature;
  const wind = data.current.wind_speed_10m;
  const code = data.current.weather_code;

  // TEXT changes
  document.getElementById('temperature').textContent = temperature + '°C';
  document.getElementById('details').textContent =
    'Feels like ' + feelsLike + '°C. Wind ' + wind + ' km/h.';
  document.getElementById('updated').textContent =
    'Last updated: ' + new Date().toLocaleTimeString();

  const weather = describeWeather(code);
  document.getElementById('description').textContent = weather.words;

  // PICTURE changes
  document.getElementById('weather-image').src = weather.image;

  // COLOUR and message change (three states)
  if (temperature < 10) {
    document.body.className = 'cold';
    document.getElementById('message').textContent = "It's feeling cold today.";
  } else if (temperature < 25) {
    document.body.className = 'mild';
    document.getElementById('message').textContent = "It's feeling pretty mild.";
  } else {
    document.body.className = 'hot';
    document.getElementById('message').textContent = "It's a hot one!";
  }
}

// event listeners
bramptonButton.addEventListener('click', function() {
  currentCity = brampton;
  getWeather();
});

torontoButton.addEventListener('click', function() {
  currentCity = toronto;
  getWeather();
});

refreshButton.addEventListener('click', getWeather);

// check again every 5 minutes so the page stays live
setInterval(getWeather, 5 * 60 * 1000);

// load the weather when the page opens
getWeather();
