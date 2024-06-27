import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/artist/${query}`);
  };

  return (
    <div className="home">
      <img src="/spotify.png" alt="Spotify Logo" className="spotify-logo" />
      <h1>Spotify Artist Tracker</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an artist"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Home;

