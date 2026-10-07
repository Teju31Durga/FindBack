import React, {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import Spinner from '../components/Spinner';

const Home = () => {
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    totalClaimed: 0,
  });

  const [recentItems, setRecentItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res =
          await api.get('/dashboard');

        const dashboardData =
          res.data?.data || res.data;

        setStats({
          totalLost:
            dashboardData?.totalLost || 0,
          totalFound:
            dashboardData?.totalFound || 0,
          totalClaimed:
            dashboardData?.totalClaimed || 0,
        });

        setRecentItems(
          dashboardData?.recentItems || []
        );
      } catch (err) {
        console.error(
          'Failed to fetch dashboard data:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="page-container">

      {/* Hero */}
      <section className="hero-section">

        <div className="hero-content">

          <h1 className="hero-title">
            FindBack
          </h1>

          <p className="hero-subtitle">
            Reconnecting people with their lost
            belongings. Report lost items, find
            what others discovered, and make your
            community a little more connected.
          </p>

          <div className="hero-actions">

            <Link
              to="/report?type=Lost"
              className="btn btn-primary"
            >
              📋 Report Lost Item
            </Link>

            <Link
              to="/report?type=Found"
              className="btn btn-success"
            >
              🎯 Report Found Item
            </Link>

          </div>

          <div className="hero-browse">

            <Link
              to="/items"
              className="btn btn-secondary"
            >
              🔍 Browse All Items
            </Link>

          </div>

        </div>

      </section>

      {/* Stats */}
      <section className="stats-section">

        <h2 className="section-title">
          System Overview
        </h2>

        {loading ? (
          <Spinner message="Loading stats..." />
        ) : (
          <div className="stats-grid">

            <div className="stat-card stat-lost">

              <div className="stat-icon">
                🔴
              </div>

              <div className="stat-number">
                {stats.totalLost}
              </div>

              <div className="stat-label">
                Lost Items Reported
              </div>

            </div>

            <div className="stat-card stat-found">

              <div className="stat-icon">
                🟢
              </div>

              <div className="stat-number">
                {stats.totalFound}
              </div>

              <div className="stat-label">
                Found Items Reported
              </div>

            </div>

            <div className="stat-card stat-claimed">

              <div className="stat-icon">
                ✅
              </div>

              <div className="stat-number">
                {stats.totalClaimed}
              </div>

              <div className="stat-label">
                Successfully Claimed
              </div>

            </div>

          </div>
        )}

      </section>

      {/* Recent Reports */}
      <section className="recent-section">

        <div className="section-header">

          <h2 className="section-title">
            Recent Reports
          </h2>

          <Link
            to="/items"
            className="btn btn-secondary btn-sm"
          >
            View All →
          </Link>

        </div>

        {loading ? (
          <Spinner message="Loading recent items..." />
        ) : recentItems.length > 0 ? (
          <div className="items-grid">

            {recentItems
              .slice(0, 5)
              .map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                />
              ))}

          </div>
        ) : (
          <div className="empty-state">

            <p>
              No items reported yet.
              Be the first to report!
            </p>

            <Link
              to="/report"
              className="btn btn-primary"
            >
              Report an Item
            </Link>

          </div>
        )}

      </section>

      {/* How It Works */}
      <section className="how-it-works">

        <h2 className="section-title">
          How It Works
        </h2>

        <div className="steps-grid">

          <div className="step-card">

            <div className="step-number">
              1
            </div>

            <h3>Report</h3>

            <p>
              Report a lost or found item with
              details and a photo.
            </p>

          </div>

          <div className="step-card">

            <div className="step-number">
              2
            </div>

            <h3>Browse</h3>

            <p>
              Search and filter items to find
              what you're looking for.
            </p>

          </div>

          <div className="step-card">

            <div className="step-number">
              3
            </div>

            <h3>Claim</h3>

            <p>
              Submit a claim request and get
              reunited with your item.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;