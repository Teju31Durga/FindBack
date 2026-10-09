import React, {
  useEffect,
  useState,
} from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../api/axios';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL =
  'https://findback-backend-aba3.onrender.com';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [claimLoading, setClaimLoading] =
    useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res =
          await api.get(`/items/${id}`);

        const itemData =
          res.data?.data || res.data;

        setItem(itemData);

        try {
          const claimsRes =
            await api.get(
              `/claims/item/${id}`
            );

          setClaims(
            claimsRes.data?.data ||
              claimsRes.data ||
              []
          );
        } catch (claimError) {
          console.log(
            'Claims could not be loaded:',
            claimError
          );

          setClaims([]);
        }
      } catch (error) {
        console.error(
          'Failed to fetch item:',
          error
        );

        toast.error(
          error.response?.data?.message ||
            'Failed to load item'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  
const getImageUrl = (image) => {
  if (!image) return null;

  // Already a complete URL
  if (image.startsWith('http')) {
    return image;
  }

  // Relative image path
  const imagePath = image.startsWith('/')
    ? image
    : `/${image}`;

  return `${BACKEND_URL}${imagePath}`;
};

  const handleClaim = async () => {
    if (!user) {
      toast.info(
        'Please login to submit a claim.'
      );

      navigate('/login');
      return;
    }

    try {
      setClaimLoading(true);

      const res = await api.post(
        '/claims',
        {
          itemId: id,
          message:
            'I believe this item belongs to me.',
        }
      );

      toast.success(
        'Claim submitted successfully!'
      );

      const newClaim =
        res.data?.data || res.data;

      if (newClaim) {
        setClaims((prev) => [
          ...prev,
          newClaim,
        ]);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to submit claim'
      );
    } finally {
      setClaimLoading(false);
    }
  };

  const handleClaimStatus = async (claimId, status) => {
  try {
    const res = await api.put(
      `/claims/${claimId}`,
      { status }
    );

    toast.success(
      `Claim ${status.toLowerCase()} successfully!`
    );

    const updatedClaim =
      res.data?.data || res.data;

    setClaims((prev) =>
      prev.map((claim) =>
        claim._id === claimId
          ? updatedClaim
          : claim
      )
    );

    // If approved, refresh item status
    if (status === 'Approved') {
      setItem((prev) => ({
        ...prev,
        status: 'Claimed',
      }));
    }

  } catch (error) {
    console.error(
      'Failed to update claim status:',
      error
    );

    toast.error(
      error.response?.data?.message ||
        'Failed to update claim status'
    );
  }
};

  if (loading) {
    return (
      <div className="page-container">
        <Spinner message="Loading item details..." />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page-container">

        <BackButton />

        <div className="empty-state">

          <h2>
            Item Not Found
          </h2>

          <p>
            The item you are looking for
            does not exist.
          </p>

          <Link
            to="/items"
            className="btn btn-primary"
          >
            Back to Items
          </Link>

        </div>

      </div>
    );
  }

console.log('ITEM DATE DEBUG:', {
  title: item.title,
  date: item.date,
  createdAt: item.createdAt,
});

  
const itemDate = item.date || item.createdAt;

const formattedDate =
  itemDate && !Number.isNaN(new Date(itemDate).getTime())
    ? new Date(itemDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const imageUrl =
    getImageUrl(item.image);

  const reportedById =
  item.reportedBy?._id?.toString?.() ||
  item.reportedBy?.toString?.() ||
  '';

const currentUserId =
  user?._id?.toString?.() ||
  user?.id?.toString?.() ||
  '';

const isOwner =
  Boolean(currentUserId) &&
  Boolean(reportedById) &&
  reportedById === currentUserId;

  const typeClass =
    item.type === 'Lost'
      ? 'badge badge-lost'
      : 'badge badge-found';

  const statusClass =
    item.status === 'Active'
      ? 'badge badge-active'
      : item.status === 'Claimed'
      ? 'badge badge-claimed'
      : 'badge badge-resolved';

  return (
    <div className="page-container item-detail-page">

      {/* BACK */}
      <BackButton />

      {/* MAIN CARD */}
      <div className="item-detail-card">

        {/* IMAGE */}
        <div className="item-detail-image-small-wrapper">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title}
              className="item-detail-image-small"
              onError={(e) => {
                e.currentTarget.style.display =
                  'none';
              }}
            />
          ) : (
            <div className="item-detail-no-image">

              <span>📷</span>

              <p>
                No image available
              </p>

            </div>
          )}

        </div>

        {/* CONTENT */}
        <div className="item-detail-content">

          {/* BADGES */}
          <div className="item-detail-badges">

            <span className={typeClass}>
              {item.type}
            </span>

            <span className={statusClass}>
              {item.status}
            </span>

          </div>

          <h1 className="item-detail-title">
            {item.title}
          </h1>

          {/* INFO */}
          <div className="item-detail-info">

            <div className="item-detail-info-row">

              <span className="item-detail-info-icon">
                📂
              </span>

              <span className="item-detail-info-label">
                Category
              </span>

              <span className="item-detail-info-value">
                {item.category}
              </span>

            </div>

            <div className="item-detail-info-row">

              <span className="item-detail-info-icon">
                📍
              </span>

              <span className="item-detail-info-label">
                Location
              </span>

              <span className="item-detail-info-value">
                {item.location}
              </span>

            </div>

            <div className="item-detail-info-row">

              <span className="item-detail-info-icon">
                📅
              </span>

              <span className="item-detail-info-label">
                Date
              </span>

              <span className="item-detail-info-value">
                {formattedDate}
              </span>

            </div>

            <div className="item-detail-info-row">

              <span className="item-detail-info-icon">
                👤
              </span>

              <span className="item-detail-info-label">
                Reported By
              </span>

              <span className="item-detail-info-value">
                {item.reportedBy?.name ||
                  'Unknown'}
              </span>

            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="item-detail-section">

            <h2>
              Description
            </h2>

            <p className="item-detail-description">
              {item.description}
            </p>

          </div>

          {/* CLAIM */}
          {!isOwner &&
            item.status === 'Active' && (
              <div className="item-detail-claim-section">

                <h2>
                  Claim This Item
                </h2>

                <p>
                  If you believe this item
                  belongs to you, submit a
                  claim request.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleClaim}
                  disabled={claimLoading}
                >
                  {claimLoading
                    ? 'Submitting...'
                    : 'Submit Claim'}
                </button>

              </div>
            )}

          {/* OWNER */}
          {isOwner && (
            <div className="item-detail-owner-section">

              <p>
                You reported this item.
              </p>

            </div>
          )}

          {/* CLAIMS */}
          {claims.length > 0 && (
            <div className="item-detail-claims-section">

              <h2 className="claims-title">
                Claims
              </h2>

              <div className="item-detail-claims-list">

                {claims.map((claim) => (
  <div
    key={claim._id}
    className="item-detail-claim-card"
  >
    <div>
      <strong className="claim-user-name">
        {claim.claimedBy?.name ||
          claim.claimant?.name ||
          claim.user?.name ||
          'User'}
      </strong>

      <p>
        {claim.message ||
          'Claim submitted for this item.'}
      </p>

      <span
  className={`badge claim-status ${
    claim.status === 'Approved'
      ? 'claim-approved'
      : claim.status === 'Rejected'
      ? 'claim-rejected'
      : 'claim-pending'
  }`}
>
  {claim.status || 'Pending'}
</span>
    </div>

    {/* Approve / Reject buttons - Owner only */}
    {isOwner && claim.status === 'Pending' && (
      <div className="claim-actions">

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            handleClaimStatus(claim._id, 'Approved')
          }
        >
          Approve
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={() =>
            handleClaimStatus(claim._id, 'Rejected')
          }
        >
          Reject
        </button>

      </div>
    )}
  </div>
))}

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ItemDetail;