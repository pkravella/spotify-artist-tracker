const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const clientId = '9d4e840a964643a4baf5afd8469a9d0c';
const clientSecret = 'd42b156dd0b44ec0ab57e43c399f588e';
let accessToken = '';

const getToken = async () => {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
    });
    accessToken = response.data.access_token;
    console.log('Access token:', accessToken);
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
};

// Refresh the token every hour
setInterval(getToken, 3600 * 1000);
getToken();

app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    console.log(`Searching for artist: ${query}`);
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    console.log('Search response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error searching for artist:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/token', (req, res) => {
  res.json({ accessToken });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});