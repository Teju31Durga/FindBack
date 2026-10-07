import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../api/axios';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

const CATEGORIES = [
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

const STATUSES = [
  'Active',
  'Claimed',
  'Resolved',
];

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/300x200?text=No+Image';

const EditModal = ({
  item,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: item.title || '',
    type: item.type || 'Lost',
    category: item.category || '',
    description: item.description || '',
    location: item.location || '',
    date: item.date
      ? item.date.split('T')[0]
      : '',
    status: item.status || 'Active',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] =
    useState(item.imageUrl || null);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category =
        'Category is required';
    }

    if (!formData.location.trim()) {
      newErrors.location =
        'Location is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.description.trim()) {
      newErrors.description =
        'Description is required';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        'Image must be less than 5MB'
      );
      return;
    }

    setImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(
        ([key, value]) => {
          data.append(key, value);
        }
      );

      if (image) {
        data.append('image', image);
      }

      const res = await api.put(
        `/items/${item._id}`,
        data,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      toast.success(
        'Item updated successfully!'
      );

      onSave(res.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Update failed'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="modal-header">

          <h2>Edit Item</h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="modal-form"
        >

          <div className="modal-body">

            <div className="form-row">

              <div className="form-group">

                <label className="form-label">
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Lost">
                    Lost
                  </option>

                  <option value="Found">
                    Found
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label className="form-label">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input"
                >
                  {STATUSES.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

            <div className="form-group">

              <label className="form-label">
                Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input${
                  errors.title
                    ? ' input-error'
                    : ''
                }`}
              />

              {errors.title && (
                <span className="error-message">
                  {errors.title}
                </span>
              )}

            </div>

            <div className="form-row">

              <div className="form-group">

                <label className="form-label">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-input${
                    errors.category
                      ? ' input-error'
                      : ''
                  }`}
                >
                  <option value="">
                    Select category
                  </option>

                  {CATEGORIES.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>

                {errors.category && (
                  <span className="error-message">
                    {errors.category}
                  </span>
                )}

              </div>

              <div className="form-group">

                <label className="form-label">
                  Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`form-input${
                    errors.date
                      ? ' input-error'
                      : ''
                  }`}
                  max={
                    new Date()
                      .toISOString()
                      .split('T')[0]
                  }
                />

                {errors.date && (
                  <span className="error-message">
                    {errors.date}
                  </span>
                )}

              </div>

            </div>

            <div className="form-group">

              <label className="form-label">
                Location *
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`form-input${
                  errors.location
                    ? ' input-error'
                    : ''
                }`}
              />

              {errors.location && (
                <span className="error-message">
                  {errors.location}
                </span>
              )}

            </div>

            <div className="form-group">

              <label className="form-label">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`form-input form-textarea${
                  errors.description
                    ? ' input-error'
                    : ''
                }`}
                rows={3}
              />

              {errors.description && (
                <span className="error-message">
                  {errors.description}
                </span>
              )}

            </div>

            <div className="form-group">

              <label className="form-label">
                Image
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="image-preview"
                  style={{
                    marginBottom: '8px',
                  }}
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />

            </div>

          </div>

          <div className="modal-footer">

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

const MyReports = () => {
  const [activeTab, setActiveTab] =
    useState('reports');

  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [claimsLoading, setClaimsLoading] =
    useState(true);

  const [editItem, setEditItem] =
    useState(null);

  const [deleteConfirmId, setDeleteConfirmId] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const fetchMyItems = useCallback(
    async () => {
      setLoading(true);

      try {
        const res =
          await api.get('/items/my');

        setItems(res.data.data || []);
      } catch (err) {
        console.error(
          'Failed to fetch my items:',
          err
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchMyClaims = useCallback(
    async () => {
      setClaimsLoading(true);

      try {
        const res =
          await api.get('/claims/my');

        setClaims(
          res.data.data || []
        );
      } catch (err) {
        console.error(
          'Failed to fetch my claims:',
          err
        );
      } finally {
        setClaimsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchMyItems();
    fetchMyClaims();
  }, [
    fetchMyItems,
    fetchMyClaims,
  ]);

  const handleDelete = async (id) => {
    setDeleting(true);

    try {
      await api.delete(`/items/${id}`);

      setItems((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        'Item deleted successfully'
      );

      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to delete item'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === updatedItem._id
          ? updatedItem
          : item
      )
    );

    setEditItem(null);
  };

  const getStatusBadge = (status) => {
    const cls =
      status === 'Active'
        ? 'badge badge-active'
        : status === 'Claimed'
        ? 'badge badge-claimed'
        : 'badge badge-resolved';

    return (
      <span className={cls}>
        {status}
      </span>
    );
  };

  const getClaimStatusBadge = (status) => {
    const cls =
      status === 'Approved'
        ? 'badge status-approved'
        : status === 'Rejected'
        ? 'badge status-rejected'
        : 'badge status-pending';

    return (
      <span className={cls}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => (
    <span
      className={`badge ${
        type === 'Lost'
          ? 'badge-lost'
          : 'badge-found'
      }`}
    >
      {type}
    </span>
  );

  return (
    <div className="page-container">

      <BackButton />

      <div className="page-header">

        <h1>My Activity</h1>

        <p>
          View and manage your reported
          items and claim requests
        </p>

      </div>

      {/* Tabs */}
      <div className="activity-tabs">

        <button
          type="button"
          className={
            activeTab === 'reports'
              ? 'active'
              : ''
          }
          onClick={() =>
            setActiveTab('reports')
          }
        >
          My Reports
        </button>

        <button
          type="button"
          className={
            activeTab === 'claims'
              ? 'active'
              : ''
          }
          onClick={() =>
            setActiveTab('claims')
          }
        >
          My Claims
        </button>

      </div>

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="tab-content">

          {loading ? (
            <Spinner message="Loading your reports..." />
          ) : items.length === 0 ? (
            <div className="empty-state">

              <p>
                You haven't reported any
                items yet.
              </p>

              <Link
                to="/report"
                className="btn btn-primary"
              >
                Report Your First Item
              </Link>

            </div>
          ) : (
            <div className="reports-table-wrapper">

              <table className="reports-table">

                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {items.map((item) => (
                    <tr key={item._id}>

                      <td>
                        <img
                          src={
                            item.imageUrl ||
                            PLACEHOLDER_IMAGE
                          }
                          alt={item.title}
                          className="table-img"
                          onError={(e) => {
                            e.target.src =
                              PLACEHOLDER_IMAGE;
                          }}
                        />
                      </td>

                      <td>
                        <Link
                          to={`/items/${item._id}`}
                          className="item-link"
                        >
                          {item.title}
                        </Link>
                      </td>

                      <td>
                        {getTypeBadge(
                          item.type
                        )}
                      </td>

                      <td>
                        {item.category}
                      </td>

                      <td>
                        {item.location}
                      </td>

                      <td>
                        {item.date
                          ? new Date(
                              item.date
                            ).toLocaleDateString()
                          : 'N/A'}
                      </td>

                      <td>
                        {getStatusBadge(
                          item.status
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="actions-cell">

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="btn btn-secondary btn-sm edit-action-btn"
                            onClick={() =>
                              setEditItem(item)
                            }
                          >
                            ✏️ Edit
                          </button>

                          {deleteConfirmId ===
                          item._id ? (
                            <div className="delete-confirm">

                              <span className="delete-question">
                                Delete item?
                              </span>

                              <div className="delete-confirm-buttons">

                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    handleDelete(
                                      item._id
                                    )
                                  }
                                  disabled={deleting}
                                >
                                  {deleting
                                    ? '...'
                                    : 'Yes'}
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() =>
                                    setDeleteConfirmId(
                                      null
                                    )
                                  }
                                >
                                  No
                                </button>

                              </div>

                            </div>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm delete-action-btn"
                              onClick={() =>
                                setDeleteConfirmId(
                                  item._id
                                )
                              }
                            >
                              🗑️ Delete
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}

      {/* Claims */}
      {activeTab === 'claims' && (
        <div className="tab-content">

          {claimsLoading ? (
            <Spinner message="Loading your claims..." />
          ) : claims.length === 0 ? (
            <div className="empty-state">

              <p>
                You haven't submitted any
                claim requests yet.
              </p>

              <Link
                to="/items"
                className="btn btn-primary"
              >
                Browse Items
              </Link>

            </div>
          ) : (
            <div className="claims-list-page">

              {claims.map((claim) => (
                <div
                  key={claim._id}
                  className="claim-list-item"
                >

                  <div className="claim-list-image">

                    <img
                      src={
                        claim.item?.imageUrl ||
                        PLACEHOLDER_IMAGE
                      }
                      alt={
                        claim.item?.title ||
                        'Item'
                      }
                      onError={(e) => {
                        e.target.src =
                          PLACEHOLDER_IMAGE;
                      }}
                    />

                  </div>

                  <div className="claim-list-details">

                    <h3>
                      <Link
                        to={`/items/${claim.item?._id}`}
                        className="item-link"
                      >
                        {claim.item?.title ||
                          'Unknown Item'}
                      </Link>
                    </h3>

                    <p className="claim-message-preview">
                      {claim.message}
                    </p>

                    <div className="claim-list-meta">

                      <span>
                        📅{' '}
                        {new Date(
                          claim.createdAt
                        ).toLocaleDateString()}
                      </span>

                      <span>
                        📍{' '}
                        {claim.item?.location}
                      </span>

                    </div>

                  </div>

                  <div className="claim-list-status">
                    {getClaimStatusBadge(
                      claim.status
                    )}
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() =>
            setEditItem(null)
          }
          onSave={handleSave}
        />
      )}

    </div>
  );
};

export default MyReports;