require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.OPENWEATHER_API_KEY || '233cb8ec620eddc8bd80038ba2824a72';

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const getCoordinates = async (city) => {
  try {
    const geocodeResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    if (geocodeResponse.data.length === 0) {
      throw new Error('City not found');
    }
    return geocodeResponse.data[0];
  } catch (error) {
    throw new Error('Failed to fetch coordinates');
  }
};

app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city || !apiKey) {
    console.error('City or API key is missing');
    return res.status(400).json({ error: 'City or API key is missing' });
  }

  try {
    console.log(`Geocoding for city: ${city}`);
    const { lat, lon } = await getCoordinates(city);
    console.log(`Coordinates for ${city}: lat=${lat}, lon=${lon}`);

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    console.log(`Weather data retrieved successfully for city: ${city}`);
    res.json(weatherResponse.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/forecast', async (req, res) => {
  const city = req.query.city;

  if (!city || !apiKey) {
    return res.status(400).json({ error: 'City or API key is missing' });
  }

  try {
    const { lat, lon } = await getCoordinates(city);

    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    res.json(forecastResponse.data);
  } catch (error) {
    console.error('Error fetching forecast data:', error.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
