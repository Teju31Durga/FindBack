import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/auth/forgot-password', {
        email: email.trim(),
      });

      toast.success(
        'If an account exists with this email, a reset link has been sent.'
      );

      setEmail('');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unable to process your request.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">

        <div className="forgot-password-header">
          <h1>Reset Password</h1>
          <p>
            Enter your registered email to receive a password reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="forgot-password-form"
        >
          <div className="form-group">
            <label
              htmlFor="email"
              className="form-label"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="form-input"
              placeholder="Enter your registered email"
              autoComplete="email"
            />
          </div>

          <div className="forgot-password-submit">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? 'Sending...'
                : 'Send Reset Link'}
            </button>
          </div>
        </form>

        <div className="forgot-password-back">
          <Link to="/login">
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;