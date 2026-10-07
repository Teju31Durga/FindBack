
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (changePassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required');
        return;
      }

      if (!formData.newPassword) {
        toast.error('New password is required');
        return;
      }

      if (formData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const profileData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };

      if (changePassword) {
        profileData.currentPassword = formData.currentPassword;
        profileData.newPassword = formData.newPassword;
      }

      await updateProfile(profileData);

      toast.success('Profile updated successfully!');

      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      setChangePassword(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    setDeleteLoading(true);

    try {
      await api.delete('/auth/profile');

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      setDeleteModalOpen(false);

      toast.success('Your account has been permanently deleted.');

      navigate('/');

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to delete account. Please try again.'
      );

      setDeleteLoading(false);
    }
  };

  const cancelDeleteAccount = () => {
    if (!deleteLoading) {
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1>Edit Profile</h1>
          <p>Update your account information</p>
        </div>

        <div className="edit-profile-container">
          <div className="edit-profile-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="button"
                className="change-password-btn"
                onClick={() => setChangePassword(!changePassword)}
              >
                🔒 {changePassword ? 'Cancel Password Change' : 'Change Password'}
              </button>

              {changePassword && (
                <div className="password-section">
                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>

                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="form-input"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>

                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-input"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>

              <div className="delete-account-section">
                <div className="delete-account-divider"></div>

                

                <p>Permanently delete your FindBack account and account access.</p>

                <button
                  type="button"
                  className="delete-account-btn"
                  onClick={handleDeleteAccount}
                >
                  Delete Account Permanently
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="delete-modal-overlay" onClick={cancelDeleteAccount}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">⚠️</div>

            <h2>Delete Account?</h2>

            <p>Are you sure you want to permanently delete your account?</p>

            <p className="delete-modal-warning">This action cannot be undone.</p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={cancelDeleteAccount}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
