
const apiKey = 'PWWG5ZSDGYK49N6NNKEG3T5P7'; // Our Visual Crossing API key

//URL for fetching weather data from Visual Crossing
const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline`;

// Mapping of weather conditions to icon URLs
const iconMapping = {
    "Clear": "https://img.icons8.com/ios-filled/50/000000/sun.png",
    "Partially cloudy": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAYFBMVEX///8AAACAgID29vbs7OyRkZHp6elVVVXe3t77+/uOjo7k5OSZmZnY2Ninp6fw8PDKysp1dXW0tLReXl44ODhERETCwsIhISEnJydjY2MwMDCgoKDR0dFqamoRERGtra3K9+xAAAAC70lEQVRoge2YaxNrMBCGLepapWj0pv7/vzzZBBU2lWrOzJkzni8yubzW2t0Ex9nZ2dnZ+f+J/qJ2fLEsmEzbL8vioTs2c4DArvgZuqHpAhR2xd+KPgA83gOeHXFIRevMW+exv0x0K74Uv+a8EfEGDOESVJBZED+g5j3md7liS3Y+eNdmxYk/uU7jMtnhPRP0UFbzuxw3i2eXMu6bJxibPej7n4IyAWiluUuR533i/E00gO4oeqM9dmjDKulk2DgtwGk2PyqTW1idj8w3EC/Es9fC+GcFA/dSjB5Ur0QuvKkf6xmAnq3RcO8GU+onjnaTmak6gZPEtOZIzCdheD/nK6dZKp+CYK1MlMBIbW4YDud+im/ACyltgMOKOkZySq4sxb3x4l1p7Wmh0FLTK9Hmmueod9dpA7hr2p1mYYVjPBo1PpF0OtU8O+F+qV3IB3MPS8Mn0qWuXzzaCx/i4cS064RH/c/aEC60y5ccqZ2hilA0ONXVDvcQASkdje/jsjTmlKV+kHUh94u3pk2YzjmCKKmL1a2S9CseRwivc9kDVqZ8NpWpk5bPtWBe3nqCbC7+Go9bsSgd81tT3GhxYb8yUWrnJxHb4SOPDMSvenHlwWVKnN4dHxNoQFN9sX5MQlHuPEaCU3JS28V9fpJEbJM2XKrjcy4dh1LuNUx64TtMvtaWqFtTjsWwnboYX3uwUZubNgniTHaJutoPHx2DbP/AWH/LvgPr6hBvPBti7b5gQh/xwaNkrMjSQOR60SQsi1ik25S+t50k+00cSo1u2rm3Vl9/DSHPG8ygQplAHQh+tnigWZiuPzt8z2JjsuQSwdwvWzOepFK11/b372hUcfKQuR1VvLGqrX7cb6+DJLUiTp2ff0A9+BZ2xdWvhl9r1Qz1V5DdSFRd7jgWc39Zc48WteeGGxxkzVn+fDM4yRpCbUTfn4No6A+kan2hAYzUtlJ1b/SREYnan5SbM/l9MeKzg7uNpMts/MXb2dnZ2fmn+AN4cSGCWwwBhQAAAABJRU5ErkJggg==",
    "Overcast": "https://img.icons8.com/ios-filled/50/000000/cloud.png",
    "Rain": "https://img.icons8.com/ios-filled/50/000000/rain.png",
    "Showers": "https://img.icons8.com/ios-filled/50/000000/rain.png",
    "Thunderstorms": "https://img.icons8.com/ios-filled/50/000000/thunderstorm.png",
    "Snow": "https://img.icons8.com/ios-filled/50/000000/snow.png",
    "Fog": "https://img.icons8.com/ios-filled/50/000000/fog.png",
    "Rain, Overcast": "https://img.icons8.com/ios-filled/50/000000/rain.png",
    "Rain, Partially cloudy": "https://img.icons8.com/ios-filled/50/000000/rain.png",
    "Rain, Showers": "https://img.icons8.com/ios-filled/50/000000/rain.png",
};

// Fetch weather data (current and extended forecast)
async function fetchWeather(city) {
    try {
        const response = await fetch(`${weatherUrl}/${city}?unitGroup=metric&key=${apiKey}&contentType=json`);

        if (!response.ok) {
            alert('Error fetching weather data. Please check your API configuration or city name.');
            return;
        }

        const data = await response.json();
        console.log('Weather Data:', data); // Log the entire data object

        displayWeather(data);
        displayExtendedForecast(data.days.slice(0, 5)); // Pass only the first 5 days to this function
        addToRecentCities(city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data');
    }
}

// Display current weather data
function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const current = data.currentConditions;
    const iconUrl = iconMapping[current.conditions] || "https://img.icons8.com/ios-filled/50/000000/question-mark.png"; // Default icon if condition not found

    weatherDisplay.innerHTML = `
        <h2 class="text-2xl font-bold">${data.resolvedAddress}</h2>
        <p class="text-lg">${current.conditions}</p>
        <img src="${iconUrl}" alt="Weather icon" class="mx-auto mb-2 w-20">
        <p class="text-xl">Temperature: ${current.temp}°C</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.windspeed} km/h</p>
    `;
}

// Display extended weather forecast for the next 5 days
function displayExtendedForecast(forecastDays) {
    const extendedForecastDiv = document.getElementById('extendedForecast');
    extendedForecastDiv.innerHTML = ''; // Clear previous forecast data

    forecastDays.forEach(day => {
        const date = new Date(day.datetime).toLocaleDateString();
        const temp = day.temp;  // Daily average temperature
        const wind = day.windspeed;   // Daily average wind speed
        const humidity = day.humidity; // Daily average humidity
        const condition = day.conditions;
        const iconUrl = iconMapping[condition] || "https://img.icons8.com/ios-filled/50/000000/question-mark.png"; // Default icon if condition not found

        const forecastCard = document.createElement('div');
        forecastCard.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'transition', 'duration-200', 'hover:shadow-lg');

        forecastCard.innerHTML = `
            <h3 class="font-semibold text-lg">${date}</h3>
            <p>${condition}</p>
            <img src="${iconUrl}" alt="${condition}" class="mx-auto mb-2 w-16">
            <p>Temp: ${temp}°C</p>
            <p>Wind: ${wind} km/h</p>
            <p>Humidity: ${humidity}%</p>
        `;

        extendedForecastDiv.appendChild(forecastCard);
    });
}

// Fetch weather for the current location
function fetchWeatherByLocation(lat, lon) {
    fetchWeather(`${lat},${lon}`);
}

// Add city to recent searches
function addToRecentCities(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!recentCities.includes(city)) {
        recentCities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
        updateRecentCitiesDropdown();
    }
}

// Update the dropdown for recent cities
function updateRecentCitiesDropdown() {
    const recentCitiesDropdown = document.getElementById('recentCitiesDropdown');
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    recentCitiesDropdown.innerHTML = `<option value="">-- Select a City --</option>`;
    recentCities.forEach(city => {
        recentCitiesDropdown.innerHTML += `<option value="${city}">${city}</option>`;
    });
}

// Event listeners
document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name');
    }
});

document.getElementById('currentLocationBtn').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
    });
});

document.getElementById('recentCitiesDropdown').addEventListener('change', (event) => {
    const selectedCity = event.target.value;
    if (selectedCity) {
        fetchWeather(selectedCity);
    }
});

// Initialize recent cities dropdown
updateRecentCitiesDropdown();
