import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = 'live_EzHP4N9lt6UEIfNQ4PuBxk73jAOOOf2KGedE5VIOk58W5Q3UlQZ3BEPaZvmykF3N';

  const fetchBreeds = async () => {
    const res = await fetch(`https://api.thecatapi.com/v1/breeds?api_key=${apiKey}`);
    const data = await res.json();
    setBreeds(data);
  };

  const getCats = async (breed = '', append = false) => {
    setLoading(true);
    let url = `https://api.thecatapi.com/v1/images/search?limit=10&api_key=${apiKey}`;
    if (breed) {
      url += `&breed_ids=${breed}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    setCats((prevCats) => (append ? [...prevCats, ...data] : data));
    setLoading(false);
  };

  useEffect(() => {
    fetchBreeds();
    getCats();
  }, []);

  const handleBreedChange = (e) => {
    const breedId = e.target.value;
    setSelectedBreed(breedId);
    getCats(breedId);
  };

  return (
    <div className="catAppContainer">
      <div className="filterCats"> 
        <label htmlFor="filter">Filter your cats here</label>
        <select value={selectedBreed} onChange={handleBreedChange} id='filter'>
          <option value="" id='filter'>All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>

        <button onClick={() => getCats(selectedBreed)} id='refresh'>Refresh</button>
      </div>

      {loading && <p>Loading...</p>}
      <div className="gallery">
        {cats.map((cat) => (
          <div key={cat.id} className="card">
            <img src={cat.url} alt="Cute Cat" id='catImg'/>
          </div>
        ))}
      </div>

      <div className="loadMoreContainer">
        <button onClick={() => getCats(selectedBreed, true)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  );
}

export default App;
