import { SalesService } from '../services/salesService.js';

export const getSales = (req, res) => {
  try {
    const salesData = req.app.locals.salesData || [];
    const salesService = new SalesService(salesData);

    // Extract query parameters
    const searchTerm = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortBy = req.query.sortBy || '';
    const sortOrder = req.query.sortOrder || 'asc';

    // Parse filters from query
    const filters = {};
    if (req.query.customerRegion) {
      filters.customerRegion = Array.isArray(req.query.customerRegion) 
        ? req.query.customerRegion 
        : [req.query.customerRegion];
    }
    if (req.query.gender) {
      filters.gender = Array.isArray(req.query.gender) 
        ? req.query.gender 
        : [req.query.gender];
    }
    if (req.query.productCategory) {
      filters.productCategory = Array.isArray(req.query.productCategory) 
        ? req.query.productCategory 
        : [req.query.productCategory];
    }
    if (req.query.tags) {
      filters.tags = Array.isArray(req.query.tags) 
        ? req.query.tags 
        : [req.query.tags];
    }
    if (req.query.paymentMethod) {
      filters.paymentMethod = Array.isArray(req.query.paymentMethod) 
        ? req.query.paymentMethod 
        : [req.query.paymentMethod];
    }
    if (req.query.ageMin || req.query.ageMax) {
      filters.ageRange = {};
      if (req.query.ageMin) filters.ageRange.min = parseInt(req.query.ageMin);
      if (req.query.ageMax) filters.ageRange.max = parseInt(req.query.ageMax);
    }
    if (req.query.dateStart || req.query.dateEnd) {
      filters.dateRange = {};
      if (req.query.dateStart) filters.dateRange.start = req.query.dateStart;
      if (req.query.dateEnd) filters.dateRange.end = req.query.dateEnd;
    }

    // Apply search, filter, sort, and pagination
    let result = salesService.search(salesData, searchTerm);
    result = salesService.filter(result, filters);
    result = salesService.sort(result, sortBy, sortOrder);
    const paginatedResult = salesService.paginate(result, page, pageSize);

    res.json({
      success: true,
      data: paginatedResult.data,
      pagination: paginatedResult.pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getFilterOptions = (req, res) => {
  try {
    const salesData = req.app.locals.salesData || [];
    const dataLoading = req.app.locals.dataLoading;
    const dataLoadError = req.app.locals.dataLoadError;

    // If data is still loading, wait a bit and return empty options
    if (dataLoading) {
      return res.json({
        success: true,
        data: {
          customerRegion: [],
          gender: [],
          ageRange: { min: 0, max: 100 },
          productCategory: [],
          tags: [],
          paymentMethod: [],
          dateRange: { min: null, max: null }
        },
        loading: true
      });
    }

    // If there was an error loading data, return error
    if (dataLoadError) {
      return res.status(500).json({
        success: false,
        error: `Failed to load data: ${dataLoadError}`
      });
    }

    const salesService = new SalesService(salesData);
    const options = salesService.getFilterOptions(salesData);

    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Error in getFilterOptions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


