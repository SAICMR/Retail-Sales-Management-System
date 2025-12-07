export class SalesService {
  constructor(data) {
    this.data = data || [];
  }

  search(data, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }

    const term = searchTerm.toLowerCase().trim();
    return data.filter(item => {
      const customerName = (item.customerName || '').toLowerCase();
      const phoneNumber = (item.phoneNumber || '').toLowerCase();
      return customerName.includes(term) || phoneNumber.includes(term);
    });
  }

  filter(data, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return data;
    }

    return data.filter(item => {
      // Customer Region filter
      if (filters.customerRegion && filters.customerRegion.length > 0) {
        if (!filters.customerRegion.includes(item.customerRegion)) {
          return false;
        }
      }

      // Gender filter
      if (filters.gender && filters.gender.length > 0) {
        if (!filters.gender.includes(item.gender)) {
          return false;
        }
      }

      // Age Range filter
      if (filters.ageRange) {
        const { min, max } = filters.ageRange;
        if (min !== undefined && item.age < min) return false;
        if (max !== undefined && item.age > max) return false;
      }

      // Product Category filter
      if (filters.productCategory && filters.productCategory.length > 0) {
        if (!filters.productCategory.includes(item.productCategory)) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const itemTags = Array.isArray(item.tags) ? item.tags : [item.tags];
        const hasMatchingTag = filters.tags.some(tag => 
          itemTags.some(itemTag => itemTag === tag)
        );
        if (!hasMatchingTag) return false;
      }

      // Payment Method filter
      if (filters.paymentMethod && filters.paymentMethod.length > 0) {
        if (!filters.paymentMethod.includes(item.paymentMethod)) {
          return false;
        }
      }

      // Date Range filter
      if (filters.dateRange) {
        const { start, end } = filters.dateRange;
        const itemDate = new Date(item.date);
        if (start && itemDate < new Date(start)) return false;
        if (end && itemDate > new Date(end)) return false;
      }

      return true;
    });
  }

  sort(data, sortBy, sortOrder = 'asc') {
    if (!sortBy) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'quantity':
          aVal = a.quantity || 0;
          bVal = b.quantity || 0;
          break;
        case 'customerName':
          aVal = (a.customerName || '').toLowerCase();
          bVal = (b.customerName || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  paginate(data, page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: data.length,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  getFilterOptions(data) {
    const regions = [...new Set(data.map(item => item.customerRegion).filter(Boolean))];
    const genders = [...new Set(data.map(item => item.gender).filter(Boolean))];
    const categories = [...new Set(data.map(item => item.productCategory).filter(Boolean))];
    const paymentMethods = [...new Set(data.map(item => item.paymentMethod).filter(Boolean))];
    
    const allTags = data.flatMap(item => 
      Array.isArray(item.tags) ? item.tags : [item.tags]
    ).filter(Boolean);
    const tags = [...new Set(allTags)];

    const ages = data.map(item => item.age).filter(age => age !== undefined);
    const minAge = ages.length > 0 ? Math.min(...ages) : 0;
    const maxAge = ages.length > 0 ? Math.max(...ages) : 100;

    const dates = data.map(item => item.date).filter(Boolean);
    const minDate = dates.length > 0 ? dates.sort()[0] : null;
    const maxDate = dates.length > 0 ? dates.sort().reverse()[0] : null;

    return {
      customerRegion: regions.sort(),
      gender: genders.sort(),
      ageRange: { min: minAge, max: maxAge },
      productCategory: categories.sort(),
      tags: tags.sort(),
      paymentMethod: paymentMethods.sort(),
      dateRange: { min: minDate, max: maxDate }
    };
  }
}

