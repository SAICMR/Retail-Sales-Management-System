# Architecture Documentation

## Backend Architecture

### Overview
The backend follows a layered architecture pattern with clear separation of concerns:

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── routes/         # API route definitions
│   ├── utils/          # Utility functions
│   └── index.js        # Application entry point
├── data/               # Data storage
└── package.json
```

### Components

#### Controllers (`controllers/salesController.js`)
- **Responsibility**: Handle HTTP requests and responses
- **Functions**:
  - `getSales`: Processes query parameters, applies search/filter/sort/pagination, returns JSON response
  - `getFilterOptions`: Returns available filter options for the UI
- **Error Handling**: Catches and returns appropriate error responses

#### Services (`services/salesService.js`)
- **Responsibility**: Core business logic for data operations
- **Class**: `SalesService`
- **Methods**:
  - `search(data, searchTerm)`: Case-insensitive search on customer name and phone number
  - `filter(data, filters)`: Applies multiple filter conditions
  - `sort(data, sortBy, sortOrder)`: Sorts data by specified field and order
  - `paginate(data, page, pageSize)`: Paginates results with metadata
  - `getFilterOptions(data)`: Extracts unique values for filter dropdowns

#### Routes (`routes/salesRoutes.js`)
- **Responsibility**: Define API endpoints
- **Endpoints**:
  - `GET /api/sales`: Fetch paginated sales data
  - `GET /api/sales/filter-options`: Fetch available filter options

#### Utils (`utils/dataLoader.js`)
- **Responsibility**: Data loading and generation
- **Functions**:
  - `loadSalesData()`: Loads data from JSON file or generates sample data
  - `generateSampleData()`: Creates realistic sample sales records

#### Entry Point (`index.js`)
- **Responsibility**: Application initialization
- **Tasks**:
  - Sets up Express server
  - Configures middleware (CORS, JSON parsing)
  - Loads sales data into memory
  - Registers routes
  - Starts HTTP server

### Data Flow

1. **Request Flow**:
   ```
   Client Request → Express Router → Controller → Service → Data Processing → Response
   ```

2. **Search/Filter/Sort/Pagination Flow**:
   - Request received with query parameters
   - Controller extracts parameters
   - Service applies operations in sequence: Search → Filter → Sort → Paginate
   - Results returned with pagination metadata

3. **Data Loading**:
   - On server startup, data is loaded from JSON file
   - If file doesn't exist, sample data is generated
   - Data stored in `app.locals` for route access

## Frontend Architecture

### Overview
The frontend uses React with a component-based architecture:

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── services/       # API communication
│   ├── styles/         # CSS stylesheets
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── public/
└── package.json
```

### Components

#### App.jsx
- **Responsibility**: Main application state management and orchestration
- **State Management**:
  - `salesData`: Current page of sales records
  - `filterOptions`: Available filter values
  - `pagination`: Pagination metadata
  - `searchTerm`: Current search query
  - `filters`: Active filter selections
  - `sortBy` / `sortOrder`: Current sort configuration
- **Effects**:
  - Loads filter options on mount
  - Fetches sales data when search/filters/sort/page changes

#### SearchBar Component
- **Responsibility**: Search input and clear functionality
- **Props**: `onSearch`, `value`
- **Features**: Real-time search with clear button

#### FilterPanel Component
- **Responsibility**: Multi-select and range filters
- **Props**: `filterOptions`, `filters`, `onFilterChange`, `onClearFilters`
- **Filter Types**:
  - Multi-select checkboxes for categorical filters
  - Range inputs for numeric and date filters

#### SortDropdown Component
- **Responsibility**: Sort field and order selection
- **Props**: `onSortChange`, `currentSort`, `currentOrder`
- **Features**: Dropdown for sort field, conditional order selector

#### SalesTable Component
- **Responsibility**: Display sales data in tabular format
- **Props**: `data`
- **Features**: Formatted currency, dates, status badges

#### Pagination Component
- **Responsibility**: Page navigation controls
- **Props**: `pagination`, `onPageChange`
- **Features**: Previous/Next buttons, page numbers, item count

### Services

#### API Service (`services/api.js`)
- **Responsibility**: HTTP communication with backend
- **Functions**:
  - `fetchSales(params)`: Fetches paginated sales data
  - `fetchFilterOptions()`: Fetches available filter options
- **Configuration**: Axios instance with base URL and headers

### Data Flow

1. **Initial Load**:
   ```
   App mounts → Fetch filter options → Fetch sales data (page 1) → Render
   ```

2. **User Interaction Flow**:
   ```
   User Action (search/filter/sort) → Update state → useEffect triggers → API call → Update UI
   ```

3. **State Synchronization**:
   - Search, filters, and sort state managed in App component
   - Changes trigger data refetch
   - Pagination resets to page 1 on filter/search/sort changes

## Module Responsibilities

### Backend Modules

| Module | Responsibility | Dependencies |
|--------|---------------|--------------|
| `index.js` | Server setup, middleware, route registration | Express, routes |
| `salesController.js` | Request handling, parameter parsing | SalesService |
| `salesService.js` | Business logic, data operations | None (pure functions) |
| `salesRoutes.js` | Route definitions | Express, controllers |
| `dataLoader.js` | Data loading/generation | File system |

### Frontend Modules

| Module | Responsibility | Dependencies |
|--------|---------------|--------------|
| `App.jsx` | State management, orchestration | All components, API service |
| `SearchBar.jsx` | Search input UI | None |
| `FilterPanel.jsx` | Filter UI | None |
| `SortDropdown.jsx` | Sort UI | None |
| `SalesTable.jsx` | Data display | None |
| `Pagination.jsx` | Navigation UI | None |
| `api.js` | HTTP communication | Axios |

## Folder Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js
│   │   ├── services/
│   │   │   └── salesService.js
│   │   ├── routes/
│   │   │   └── salesRoutes.js
│   │   ├── utils/
│   │   │   └── dataLoader.js
│   │   └── index.js
│   ├── data/
│   │   └── sales_data.json (generated)
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── SortDropdown.jsx
│   │   │   ├── SalesTable.jsx
│   │   │   └── Pagination.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── SearchBar.css
│   │   │   ├── FilterPanel.css
│   │   │   ├── SortDropdown.css
│   │   │   ├── SalesTable.css
│   │   │   └── Pagination.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── architecture.md
│
└── README.md
```

## Design Decisions

### Backend
1. **In-Memory Data**: Data loaded into memory for fast access. Suitable for moderate datasets.
2. **Layered Architecture**: Clear separation allows for easy testing and maintenance.
3. **Service Pattern**: Business logic isolated in service class, reusable across controllers.
4. **Query Parameter Parsing**: Flexible parameter handling supports multiple filter values.

### Frontend
1. **Component-Based**: Modular components for maintainability and reusability.
2. **Centralized State**: App component manages all state for predictable data flow.
3. **Effect-Based Fetching**: useEffect hooks trigger data fetching on state changes.
4. **Responsive Design**: CSS Grid and Flexbox for adaptive layouts.

### Data Processing
1. **Sequential Operations**: Search → Filter → Sort → Paginate ensures consistent results.
2. **Case-Insensitive Search**: Improves user experience and search accuracy.
3. **State Preservation**: All filters, search, and sort maintained across pagination.

## Scalability Considerations

### Current Implementation
- Suitable for datasets up to ~10,000 records
- In-memory processing provides fast response times
- Client-side pagination reduces data transfer

### Future Enhancements
- Database integration for larger datasets
- Server-side caching for frequently accessed data
- Indexed search for improved performance
- WebSocket support for real-time updates
- Advanced filtering with query builders


