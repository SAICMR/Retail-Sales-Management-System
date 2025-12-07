import '../styles/SortDropdown.css';

function SortDropdown({ onSortChange, currentSort, currentOrder }) {
  const sortOptions = [
    { value: 'date', label: 'Date (Newest First)' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'customerName', label: 'Customer Name (A-Z)' }
  ];

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      onSortChange('', 'asc');
    } else {
      // For date, default to desc (newest first)
      const order = value === 'date' ? 'desc' : 'asc';
      onSortChange(value, order);
    }
  };

  const handleOrderChange = (e) => {
    if (currentSort) {
      onSortChange(currentSort, e.target.value);
    }
  };

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select" className="sort-label">Sort By:</label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleSortChange}
        className="sort-select"
      >
        <option value="">None</option>
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {currentSort && (
        <select
          value={currentOrder}
          onChange={handleOrderChange}
          className="sort-order-select"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      )}
    </div>
  );
}

export default SortDropdown;

