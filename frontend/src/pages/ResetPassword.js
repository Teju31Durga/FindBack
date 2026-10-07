import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    toast.success('Password reset successfully!');

    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">

        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Create a new password for your FindBack account.</p>
        </div>

        <form
          className="reset-password-form"
          onSubmit={handleSubmit}
        >

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>

            <input
              type={showPasswords ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div>

          {/* Confirm New Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>

            <input
              type={showPasswords ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </div>

          {/* Show Password */}
          <div className="show-password-row">
            <label>
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={() =>
                  setShowPasswords(!showPasswords)
                }
              />
              <span>Show passwords</span>
            </label>
          </div>

          {/* Reset Button */}
          <div className="reset-password-submit">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Reset Password
            </button>
          </div>

        </form>

        {/* Back */}
        <div className="reset-password-back">
          <Link to="/login">
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;