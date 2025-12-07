import { useState } from 'react';
import '../styles/SearchBar.css';

function SearchBar({ onSearch, value }) {
  const [searchTerm, setSearchTerm] = useState(value || '');

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by customer name or phone number..."
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
      />
      {searchTerm && (
        <button onClick={handleClear} className="search-clear" aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;


