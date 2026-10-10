import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import api from '../api/axios';
import Spinner from '../components/Spinner';
import ItemCard from '../components/ItemCard';
import BackButton from '../components/BackButton';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    totalClaimed: 0,
    activeReports: 0,
  });

  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await api.get('/dashboard');
        const dashboardData = res.data?.data ?? res.data;

        setStats({
          totalLost: dashboardData?.totalLost ?? 0,
          totalFound: dashboardData?.totalFound ?? 0,
          totalClaimed: dashboardData?.totalClaimed ?? 0,
          activeReports: dashboardData?.activeReports ?? 0,
        });

        const items = Array.isArray(dashboardData?.recentItems)
          ? dashboardData.recentItems
          : [];

        // Ensure each item has a usable date field for ItemCard.
        const normalizedItems = items.map((item) => ({
          ...item,
          date: item.date || item.createdAt || null,
        }));

        setRecentItems(normalizedItems);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setRecentItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: 'Total Lost',
      value: stats.totalLost,
      icon: '🔴',
      color: 'stat-card-lost',
      description: 'Items reported as lost',
    },
    {
      label: 'Total Found',
      value: stats.totalFound,
      icon: '🟢',
      color: 'stat-card-found',
      description: 'Items reported as found',
    },
    {
      label: 'Successfully Claimed',
      value: stats.totalClaimed,
      icon: '✅',
      color: 'stat-card-claimed',
      description: 'Items returned to owners',
    },
    {
      label: 'Active Reports',
      value: stats.activeReports,
      icon: '📋',
      color: 'stat-card-active',
      description: 'Currently open reports',
    },
  ];

  return (
    <div className="page-container">
      <BackButton />

      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of the Lost &amp; Found system</p>
      </div>

      {loading ? (
        <Spinner message="Loading dashboard..." />
      ) : (
        <>
          {/* Stats */}
          <section className="dashboard-stats">
            <div className="dashboard-stats-grid">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className={`dashboard-stat-card ${card.color}`}
                >
                  <div className="dashboard-stat-icon">
                    {card.icon}
                  </div>

                  <div className="dashboard-stat-content">
                    <div className="dashboard-stat-value">
                      {card.value}
                    </div>

                    <div className="dashboard-stat-label">
                      {card.label}
                    </div>

                    <div className="dashboard-stat-desc">
                      {card.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Reports */}
          <section className="dashboard-recent">
            <div className="section-header">
              <h2>Recent Reports</h2>

              <Link
                to="/items"
                className="btn btn-secondary btn-sm"
              >
                View All →
              </Link>
            </div>

            {recentItems.length > 0 ? (
              <div className="items-grid">
                {recentItems.slice(0, 5).map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No items reported yet.</p>

                <Link
                  to="/report"
                  className="btn btn-primary"
                >
                  Be the First to Report
                </Link>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="dashboard-actions">
            <h2>Quick Actions</h2>

            <div className="quick-actions-grid">
              <Link
                to="/report"
                className="quick-action-card"
              >
                <span className="quick-action-icon">📝</span>
                <span className="quick-action-label">
                  Report Item
                </span>
              </Link>

              <Link
                to="/items"
                className="quick-action-card"
              >
                <span className="quick-action-icon">🔍</span>
                <span className="quick-action-label">
                  Browse Items
                </span>
              </Link>

              <Link
                to="/my-reports"
                className="quick-action-card"
              >
                <span className="quick-action-icon">📁</span>
                <span className="quick-action-label">
                  My Reports
                </span>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
