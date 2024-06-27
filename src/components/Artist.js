import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Artist.css';

function Artist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.get('http://localhost:4000/token');
        setAccessToken(response.data.accessToken);
      } catch (error) {
        setError('Error fetching access token');
        console.error('Error fetching access token', error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchArtistData = async () => {
      try {
        console.log('Fetching artist data...');
        const artistResponse = await axios.get(`http://localhost:4000/search?query=${id}`);
        console.log('Artist response:', artistResponse.data);
        const artistData = artistResponse.data.artists.items[0];
        setArtist(artistData);

        const artistId = artistData.id;

        console.log('Fetching albums...');
        const albumsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        console.log('Albums response:', albumsResponse.data);
        setAlbums(albumsResponse.data.items);

        console.log('Fetching top tracks...');
        const topTracksResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        console.log('Top tracks response:', topTracksResponse.data);
        setTopTracks(topTracksResponse.data.tracks);

        console.log('Fetching related artists...');
        const relatedArtistsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        console.log('Related artists response:', relatedArtistsResponse.data);
        setRelatedArtists(relatedArtistsResponse.data.artists);

      } catch (error) {
        setError('Error fetching artist data');
        console.error('Error fetching the artist data', error);
      }
    };

    fetchArtistData();
  }, [id, accessToken]);

  if (error) return <div>{error}</div>;
  if (!artist) return <div>Loading...</div>;

  return (
    <div className="artist">
      <button className="home-button" onClick={() => navigate('/')}>Home</button>
      <img src={artist.images.length > 0 ? artist.images[0].url : ''} alt={artist.name} />
      <h1>{artist.name}</h1>
      <div className="stats">
        <p>Followers: {artist.followers.total}</p>
        <p>Popularity: {artist.popularity}</p>
        <p>Genres: {artist.genres.join(', ')}</p>
        <p>Number of Albums: {albums.length}</p>
      </div>
      <h2>Top Tracks</h2>
      <ul>
        {topTracks.map(track => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
      <h2>Related Artists</h2>
      <ul>
        {relatedArtists.map(relatedArtist => (
          <li key={relatedArtist.id}>{relatedArtist.name}</li>
        ))}
      </ul>
      <p><a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">View on Spotify</a></p>
    </div>
  );
}

export default Artist;
