import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

const CATEGORIES = [
  'All',
  'Electronics',
  'Clothing',
  'Accessories',
  'Documents',
  'Keys',
  'Wallet/Bag',
  'Books',
  'Sports',
  'Pets',
  'Other',
];

const STATUSES = ['All', 'Active', 'Claimed', 'Resolved'];
const TYPES = ['All', 'Lost', 'Found'];
const ITEMS_PER_PAGE = 9;

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    keyword: '',
    type: 'All',
    category: 'All',
    status: 'All',
    location: '',
  });

  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    type: 'All',
    category: 'All',
    status: 'All',
    location: '',
  });

  const fetchItems = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
      };

      if (appliedFilters.keyword) {
        params.keyword = appliedFilters.keyword;
      }

      if (appliedFilters.type !== 'All') {
        params.type = appliedFilters.type;
      }

      if (appliedFilters.category !== 'All') {
        params.category = appliedFilters.category;
      }

      if (appliedFilters.status !== 'All') {
        params.status = appliedFilters.status;
      }

      if (appliedFilters.location) {
        params.location = appliedFilters.location;
      }

      const res = await api.get('/items', { params });

      const responseData = res.data?.data ?? res.data;

      const fetchedItems = Array.isArray(responseData)
        ? responseData
        : responseData?.items || [];

      const total = Array.isArray(responseData)
        ? responseData.length
        : responseData?.total ?? fetchedItems.length;

      setItems(fetchedItems);
      setTotalCount(total);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setItems([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const handleReset = () => {
    const reset = {
      keyword: '',
      type: 'All',
      category: 'All',
      status: 'All',
      location: '',
    };

    setFilters(reset);
    setAppliedFilters(reset);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="page-container">

      <BackButton />

      <div className="page-header">
        <h1>Browse Items</h1>
        <p>
          Search through lost and found reports in your community
        </p>
      </div>

      {/* Filters */}
      <div className="filters-section">

        <div className="filter-row">

          <div className="form-group">
            <label className="form-label">
              Search
            </label>

            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              className="form-input"
              placeholder="Search by keyword..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Type
            </label>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="form-input"
            >
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Category
            </label>

            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="form-input"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Status
            </label>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="form-input"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="form-input"
              placeholder="Filter by location..."
            />
          </div>

        </div>

        <div className="filter-actions">

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleApply}
          >
            Apply Filters
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Reset
          </button>

        </div>

      </div>

      {/* Results Count */}
      <div className="results-info">
        {!loading && (
          <p>
            Showing <strong>{items.length}</strong> of{' '}
            <strong>{totalCount}</strong> items
          </p>
        )}
      </div>

      {/* Items */}
      {loading ? (
        <Spinner message="Loading items..." />
      ) : items.length > 0 ? (
        <>
          <div className="items-grid">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.max(currentPage - 1, 1)
                  )
                }
                disabled={page === 1}
              >
                ← Previous
              </button>

              <span className="page-info">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(currentPage + 1, totalPages)
                  )
                }
                disabled={page === totalPages}
              >
                Next →
              </button>

            </div>
          )}
        </>
      ) : (
        <div className="empty-state">

          <p>
            No items found matching your criteria.
          </p>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            Clear Filters
          </button>

        </div>
      )}

    </div>
  );
};

export default ItemList;