# Retail Sales Management System - Backend

## Overview
RESTful API backend for the Retail Sales Management System, providing endpoints for search, filtering, sorting, and pagination of sales data.

## Tech Stack
- Node.js
- Express.js
- ES6 Modules

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### GET /api/sales
Get paginated sales data with search, filter, and sort capabilities.

**Query Parameters:**
- `search` - Search term for customer name or phone number
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `sortBy` - Sort field: 'date', 'quantity', or 'customerName'
- `sortOrder` - 'asc' or 'desc'
- `customerRegion` - Filter by region (can be multiple)
- `gender` - Filter by gender (can be multiple)
- `productCategory` - Filter by category (can be multiple)
- `tags` - Filter by tags (can be multiple)
- `paymentMethod` - Filter by payment method (can be multiple)
- `ageMin` - Minimum age
- `ageMax` - Maximum age
- `dateStart` - Start date (YYYY-MM-DD)
- `dateEnd` - End date (YYYY-MM-DD)

### GET /api/sales/filter-options
Get available filter options for the UI.

### GET /api/health
Health check endpoint.

