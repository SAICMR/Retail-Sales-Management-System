import '../styles/FilterPanel.css';

function FilterPanel({ filterOptions, filters, onFilterChange, onClearFilters }) {
  if (filterOptions === null) {
    return <div className="filter-panel">Loading filter options...</div>;
  }
  
  if (filterOptions && Object.keys(filterOptions).length === 0) {
    return (
      <div className="filter-panel">
        <div style={{ padding: '20px', color: '#d32f2f' }}>
          Failed to load filter options. Please check if the backend server is running on port 3001.
        </div>
      </div>
    );
  }

  const handleMultiSelect = (filterType, value, checked) => {
    const currentValues = filters[filterType] || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    onFilterChange(filterType, newValues);
  };

  const handleRangeChange = (filterType, field, value) => {
    onFilterChange(filterType, { [field]: value });
  };

  const hasActiveFilters = () => {
    return (
      filters.customerRegion.length > 0 ||
      filters.gender.length > 0 ||
      filters.productCategory.length > 0 ||
      filters.tags.length > 0 ||
      filters.paymentMethod.length > 0 ||
      filters.ageRange.min !== '' ||
      filters.ageRange.max !== '' ||
      filters.dateRange.start !== '' ||
      filters.dateRange.end !== ''
    );
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters() && (
          <button onClick={onClearFilters} className="clear-filters-btn">
            Clear All
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Customer Region */}
        <div className="filter-group">
          <label className="filter-label">Customer Region</label>
          <div className="filter-checkboxes">
            {filterOptions.customerRegion?.map(region => (
              <label key={region} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.customerRegion.includes(region)}
                  onChange={(e) => handleMultiSelect('customerRegion', region, e.target.checked)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="filter-group">
          <label className="filter-label">Gender</label>
          <div className="filter-checkboxes">
            {filterOptions.gender?.map(gender => (
              <label key={gender} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.gender.includes(gender)}
                  onChange={(e) => handleMultiSelect('gender', gender, e.target.checked)}
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Range */}
        <div className="filter-group">
          <label className="filter-label">Age Range</label>
          <div className="filter-range">
            <input
              type="number"
              placeholder="Min"
              value={filters.ageRange.min}
              onChange={(e) => handleRangeChange('ageRange', 'min', e.target.value)}
              min={filterOptions.ageRange?.min}
              max={filterOptions.ageRange?.max}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.ageRange.max}
              onChange={(e) => handleRangeChange('ageRange', 'max', e.target.value)}
              min={filterOptions.ageRange?.min}
              max={filterOptions.ageRange?.max}
            />
          </div>
        </div>

        {/* Product Category */}
        <div className="filter-group">
          <label className="filter-label">Product Category</label>
          <div className="filter-checkboxes">
            {filterOptions.productCategory?.map(category => (
              <label key={category} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.productCategory.includes(category)}
                  onChange={(e) => handleMultiSelect('productCategory', category, e.target.checked)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="filter-group">
          <label className="filter-label">Tags</label>
          <div className="filter-checkboxes">
            {filterOptions.tags?.map(tag => (
              <label key={tag} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={(e) => handleMultiSelect('tags', tag, e.target.checked)}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="filter-group">
          <label className="filter-label">Payment Method</label>
          <div className="filter-checkboxes">
            {filterOptions.paymentMethod?.map(method => (
              <label key={method} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.paymentMethod.includes(method)}
                  onChange={(e) => handleMultiSelect('paymentMethod', method, e.target.checked)}
                />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="filter-group">
          <label className="filter-label">Date Range</label>
          <div className="filter-range">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleRangeChange('dateRange', 'start', e.target.value)}
              max={filterOptions.dateRange?.max}
            />
            <span>to</span>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleRangeChange('dateRange', 'end', e.target.value)}
              min={filterOptions.dateRange?.min}
              max={filterOptions.dateRange?.max}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;


