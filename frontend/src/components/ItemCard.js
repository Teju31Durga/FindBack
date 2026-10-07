import React from 'react';
import { Link } from 'react-router-dom';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/300x200?text=No+Image';

const BACKEND_URL = 'http://localhost:5000';

const ItemCard = ({ item }) => {
  const {
    _id,
    title,
    type,
    category,
    location,
    date,
    status,
    image,
  } = item;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const imageSrc = image
    ? image.startsWith('http')
      ? image
      : `${BACKEND_URL}${image}`
    : PLACEHOLDER_IMAGE;

  const statusClass =
    status === 'Active'
      ? 'badge badge-active'
      : status === 'Claimed'
      ? 'badge badge-claimed'
      : 'badge badge-resolved';

  return (
    <div className="item-card">

      {/* TYPE BADGE + IMAGE */}
      <div className="item-card-image-wrapper">

        {/* LOST / FOUND BADGE */}
        <div className="item-card-type-row">
          <span
            className={
              type === 'Lost'
                ? 'item-card-type-badge item-card-type-lost'
                : 'item-card-type-badge item-card-type-found'
            }
          >
            {type}
          </span>
        </div>

        {/* IMAGE */}
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

        <h3 className="item-card-title">
          {title}
        </h3>

        <div className="item-card-meta">

          <span className="item-card-category">
            📂 {category}
          </span>

          <span className="item-card-location">
            📍 {location}
          </span>

          <span className="item-card-date">
            📅 {formattedDate}
          </span>

        </div>

        {/* FOOTER */}
        <div className="item-card-footer">

          <span className={statusClass}>
            {status}
          </span>

          <Link
            to={`/items/${_id}`}
            className="btn btn-primary btn-sm"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
};

export default ItemCard;