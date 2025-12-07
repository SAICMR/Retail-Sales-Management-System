# Retail Sales Management System

## Overview
A full-stack Retail Sales Management System that provides comprehensive search, filtering, sorting, and pagination capabilities for sales transaction data. The system is built with a clean, modular architecture separating frontend and backend concerns, demonstrating professional software engineering practices.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: React 18, Vite, Axios
- **Architecture**: RESTful API with separation of concerns

## Search Implementation Summary
The search functionality performs case-insensitive full-text search across customer names and phone numbers. The backend service filters records in-memory, matching any occurrence of the search term within these fields. Search works seamlessly with filters and sorting, maintaining state across pagination.

## Filter Implementation Summary
Multi-select and range-based filtering is implemented for:
- Customer Region (multi-select)
- Gender (multi-select)
- Age Range (numeric range)
- Product Category (multi-select)
- Tags (multi-select)
- Payment Method (multi-select)
- Date Range (date range)

Filters operate independently and can be combined. The backend applies all active filters sequentially, and filter state persists alongside search and sorting operations.

## Sorting Implementation Summary
Sorting supports three fields:
- Date (defaults to newest first when selected)
- Quantity (numeric sorting)
- Customer Name (alphabetical sorting)

Each sort option supports ascending and descending order. Sorting is applied after search and filtering, ensuring consistent results across pagination.

## Pagination Implementation Summary
Pagination displays 10 items per page with:
- Previous/Next navigation buttons
- Page number indicators
- Total items and page count display
- State preservation across search, filter, and sort changes

The backend calculates pagination metadata including total pages, current page, and navigation availability. Page state resets to page 1 when search, filters, or sorting changes.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3001`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Running the Application
1. Start the backend server first (from the backend directory)
2. Start the frontend development server (from the frontend directory)
3. Open `http://localhost:3000` in your browser

The application will automatically generate sample data if no data file is found in `backend/data/sales_data.json`.

