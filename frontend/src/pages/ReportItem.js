import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import BackButton from '../components/BackButton';
const ReportItem = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    title: '',
    type: searchParams.get('reportType') === 'Found' ? 'Found' : 'Lost',
    category: 'Electronics',
    description: '',
    location: '',
    date: '',
  });
   useEffect(() => {
    const selectedType =
      searchParams.get('type') === 'Found'
        ? 'Found'
        : 'Lost';

    setFormData((prev) => ({
      ...prev,
      type: selectedType,
    }));
  }, [searchParams]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Select',
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a JPG, JPEG or PNG image.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.');
      e.target.value = '';
      return;
    }

    setImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);

    toast.success('Image selected successfully!');
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);

    const input = document.getElementById('itemImage');

    if (input) {
      input.value = '';
    }

    toast.info('Image removed.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter an item title.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description.');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Please enter the location.');
      return;
    }

    if (!formData.date) {
      toast.error('Please select the date.');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append('title', formData.title.trim());
      data.append('type', formData.type);
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('location', formData.location.trim());
      data.append('date', formData.date);

      if (image) {
        data.append('image', image);
      }

      await api.post('/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Item reported successfully!');

      navigate('/my-reports');
    } catch (error) {
      console.error('Failed to report item:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to report item. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="findback-report-page">

      {/* PAGE HEADER */}
      <div className="findback-report-header">
        <h1>Report an Item</h1>

        <p>
          Report a lost or found item to help reconnect it with its owner.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="findback-report-card">

        <form onSubmit={handleSubmit}>

          {/* REPORT TYPE */}
          <div className="findback-report-types">

  <div
    className="findback-report-type active"
    style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      cursor: 'default',
    }}
  >
    <span className="findback-report-type-icon">
      {formData.type === 'Lost' ? '🔴' : '🟢'}
    </span>

    <strong>
      {formData.type === 'Lost'
        ? 'Lost Item'
        : 'Found Item'}
    </strong>

    <small>
      {formData.type === 'Lost'
        ? 'This item was lost and needs to be found.'
        : 'This item was found and needs to reach its owner.'}
    </small>
  </div>
</div>
          {/* ITEM TITLE */}
          <div className="findback-report-field">

            <label htmlFor="report-title">
              Item Title <span>*</span>
            </label>

            <input
              id="report-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Black Dell Laptop"
              maxLength={100}
            />

          </div>

          {/* CATEGORY */}
          <div className="findback-report-field">

            <label htmlFor="report-category">
              Category <span>*</span>
            </label>

            <select
              id="report-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

          </div>

          {/* DESCRIPTION */}
          <div className="findback-report-field">

            <label htmlFor="report-description">
              Description <span>*</span>
            </label>

            <textarea
              id="report-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item, color, brand, identifying marks, etc."
              maxLength={1000}
              rows={5}
            />

            <small>
              {formData.description.length}/1000 characters
            </small>

          </div>

          {/* LOCATION */}
          <div className="findback-report-field">

            <label htmlFor="report-location">
              Location <span>*</span>
            </label>

            <input
              id="report-location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. College Library"
              maxLength={200}
            />

          </div>

          {/* DATE */}
          <div className="findback-report-field">

            <label htmlFor="report-date">
              Date <span>*</span>
            </label>

            <input
              id="report-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

          </div>

            {/* IMAGE */}
<div
  style={{
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: '28px',
  }}
>
  <div
    style={{
      width: '100%',
      marginBottom: '14px',
      color: '#172554',
      fontSize: '15px',
      fontWeight: '600',
      textAlign: 'center',
    }}
  >
    Item Image
  </div>

  {/* Hidden real file input */}
  <input
    id="itemImage"
    type="file"
    accept="image/jpeg,image/jpg,image/png"
    onChange={handleImageChange}
    style={{
      display: 'none',
    }}
  />

  {/* ONLY BLUE BUTTON */}
  <button
    type="button"
    onClick={() => {
      document.getElementById('itemImage')?.click();
    }}
    style={{
      width: '135px',
      height: '42px',
      padding: '0',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: '#2563eb',
      color: '#ffffff',

      border: 'none',
      borderRadius: '8px',

      fontSize: '14px',
      fontWeight: '600',
      fontFamily: 'inherit',

      cursor: 'pointer',
      boxSizing: 'border-box',
    }}
  >
    Choose File
  </button>

  {/* HELP TEXT */}
  <div
    style={{
      width: '100%',
      marginTop: '10px',
      color: '#64748b',
      fontSize: '12px',
      lineHeight: '1.4',
      textAlign: 'center',
    }}
  >
    <div>JPG, JPEG or PNG.</div>
    <div>Maximum size: 5MB.</div>
  </div>
</div>
 

          {/* SELECTED IMAGE */}
          {image && (
            <div className="findback-selected-image">

              <div className="findback-image-preview">
                <img
                  src={imagePreview}
                  alt={image.name}
                />
              </div>

              <div className="findback-image-details">

                <div className="findback-image-name">
                  📄 {image.name}
                </div>

                <div className="findback-image-size">
                  {(image.size / 1024 / 1024).toFixed(2)} MB
                </div>

              </div>

              <div className="findback-image-actions">

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById('itemImage')
                      ?.click()
                  }
                >
                  🔄 Change Image
                </button>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                >
                  ✕ Remove
                </button>

              </div>

            </div>
          )}

          {/* ACTIONS */}
          <div className="findback-report-actions">

            <button
              type="button"
              className="findback-cancel-btn"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="findback-submit-btn"
              disabled={loading}
            >
              {loading
                ? 'Submitting...'
                : 'Submit Report'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ReportItem;