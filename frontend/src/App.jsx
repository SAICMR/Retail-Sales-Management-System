import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SalesTable from './components/SalesTable';
import Pagination from './components/Pagination';
import SortDropdown from './components/SortDropdown';
import { fetchSales, fetchFilterOptions } from './services/api';
import './styles/App.css';

function App() {
  const [salesData, setSalesData] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // State for search, filters, and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    customerRegion: [],
    gender: [],
    ageRange: { min: '', max: '' },
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateRange: { start: '', end: '' }
  });
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load sales data when search, filters, sort, or page changes
  useEffect(() => {
    loadSalesData();
  }, [searchTerm, filters, sortBy, sortOrder, pagination.currentPage]);

  const loadFilterOptions = async () => {
    try {
      const response = await fetchFilterOptions();
      if (response && response.data) {
        setFilterOptions(response.data);
      } else {
        console.error('Invalid response from filter options API:', response);
        setFilterOptions({}); // Set empty object to prevent infinite loading
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
      console.error('Error details:', error.response?.data || error.message);
      setFilterOptions({}); // Set empty object to prevent infinite loading
    }
  };

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...(sortBy && { sortBy, sortOrder })
      };

      // Add filters to params
      if (filters.customerRegion.length > 0) {
        params.customerRegion = filters.customerRegion;
      }
      if (filters.gender.length > 0) {
        params.gender = filters.gender;
      }
      if (filters.productCategory.length > 0) {
        params.productCategory = filters.productCategory;
      }
      if (filters.tags.length > 0) {
        params.tags = filters.tags;
      }
      if (filters.paymentMethod.length > 0) {
        params.paymentMethod = filters.paymentMethod;
      }
      if (filters.ageRange.min) {
        params.ageMin = filters.ageRange.min;
      }
      if (filters.ageRange.max) {
        params.ageMax = filters.ageRange.max;
      }
      if (filters.dateRange.start) {
        params.dateStart = filters.dateRange.start;
      }
      if (filters.dateRange.end) {
        params.dateEnd = filters.dateRange.end;
      }

      const response = await fetchSales(params);
      setSalesData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'ageRange' || filterType === 'dateRange') {
        newFilters[filterType] = { ...prev[filterType], ...value };
      } else {
        newFilters[filterType] = value;
      }
      
      return newFilters;
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const clearFilters = () => {
    setFilters({
      customerRegion: [],
      gender: [],
      ageRange: { min: '', max: '' },
      productCategory: [],
      tags: [],
      paymentMethod: [],
      dateRange: { start: '', end: '' }
    });
    setSearchTerm('');
    setSortBy('');
    setSortOrder('asc');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Retail Sales Management System</h1>
      </header>
      
      <main className="app-main">
        <div className="controls-section">
          <div className="search-sort-row">
            <SearchBar onSearch={handleSearch} value={searchTerm} />
            <SortDropdown 
              onSortChange={handleSortChange} 
              currentSort={sortBy}
              currentOrder={sortOrder}
            />
          </div>
          
          <FilterPanel
            filterOptions={filterOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </div>

        <div className="table-section">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : salesData.length === 0 ? (
            <div className="no-results">No sales records found</div>
          ) : (
            <>
              <SalesTable data={salesData} />
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;


