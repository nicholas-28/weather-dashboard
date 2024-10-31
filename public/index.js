document.getElementById('get-weather-btn').addEventListener('click', async () => {
  let city = document.getElementById('city-input').value.trim();
  if (city) {
    try {
      const url = `/weather?city=${encodeURIComponent(city)}`;
      console.log(`Fetching weather with URL: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('City not found');

      const data = await response.json();
      console.log('Weather data:', data);

      document.getElementById('weather-info').innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
      `;


      const forecastUrl = `/forecast?city=${encodeURIComponent(city)}`;
      console.log(`Fetching forecast with URL: ${forecastUrl}`);
      
      const forecastResponse = await fetch(forecastUrl);
      if (!forecastResponse.ok) throw new Error('City not found');
      
      const forecastData = await forecastResponse.json();
      console.log('Forecast data:', forecastData);
      
      let forecastHTML = '';
      for (let i = 0; i < forecastData.list.length; i += 8) {
        const forecast = forecastData.list[i];
        forecastHTML += `
          <div class="forecast-card">
            <h3>${new Date(forecast.dt * 1000).toLocaleDateString()}</h3>
            <p>Temp: ${forecast.main.temp}°C</p>
            <p>Weather: ${forecast.weather[0].description}</p>
          </div>`;
      }

      document.getElementById('forecast-info').innerHTML = forecastHTML;

    } catch (error) {
      console.error('Error fetching weather:', error);
      document.getElementById('weather-info').innerText = 'Error fetching weather data.';
    }
  }
});
