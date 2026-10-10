import React from 'react';
import { Link } from 'react-router-dom';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">' +
      '<rect width="100%" height="100%" fill="#e5e7eb"/>' +
      '<text x="50%" y="50%" font-family="Arial" font-size="18" fill="#6b7280" ' +
      'text-anchor="middle" dominant-baseline="middle">No Image</text>' +
      '</svg>'
  );

const BACKEND_URL = 'https://findback-backend-aba3.onrender.com';

const STATUS_CLASSES = {
  Active: 'badge badge-active',
  Claimed: 'badge badge-claimed',
};

const getImageSrc = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;
  if (image.startsWith('http')) return image;
  return `${BACKEND_URL}${image.startsWith('/') ? image : `/${image}`}`;
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ItemCard = ({ item }) => {
  if (!item) return null;

  const {
    _id,
    title,
    type,
    category,
    location,
    date,
    createdAt,
    status,
    image,
  } = item;

  const formattedDate = formatDate(date || createdAt);
  const imageSrc = getImageSrc(image);
  const statusClass = STATUS_CLASSES[status] || 'badge badge-resolved';

  const typeClass =
    type === 'Lost'
      ? 'item-card-type-badge item-card-type-lost'
      : 'item-card-type-badge item-card-type-found';

  return (
    <div className="item-card">
      {/* TYPE BADGE + IMAGE */}
      <div className="item-card-image-wrapper">
        <div className="item-card-type-row">
          <span className={typeClass}>{type}</span>
        </div>

        <div className="item-card-image-container">
          <img
            src={imageSrc}
            alt={title}
            className="item-card-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="item-card-body">
        <h3 className="item-card-title">{title}</h3>

        <div className="item-card-meta">
          <span className="item-card-category">📂 {category}</span>
          <span className="item-card-location">📍 {location}</span>
          <span className="item-card-date">📅 {formattedDate}</span>
        </div>

        {/* FOOTER */}
        <div className="item-card-footer">
          <span className={statusClass}>{status}</span>

          <Link to={`/items/${_id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;