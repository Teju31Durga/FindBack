import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);

      toast.success('Login successful! Welcome back!');
      navigate('/');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';

      toast.error(message);
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Login Header */}
        <div className="auth-header">
          <h2>🔐 Welcome Back</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
          noValidate
        >
          {errors.general && (
            <div className="alert alert-error">
              {errors.general}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${
                errors.email ? 'input-error' : ''
              }`}
              placeholder="you@example.com"
              autoComplete="email"
            />

            {errors.email && (
              <span className="error-message">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
<div className="form-group">
  <label htmlFor="password" className="form-label">
    Password
  </label>

  <input
    type="password"
    id="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    className={`form-input ${
      errors.password ? 'input-error' : ''
    }`}
    placeholder="Enter your password"
    autoComplete="current-password"
  />

  {errors.password && (
    <span className="error-message">
      {errors.password}
    </span>
  )}

  <div className="forgot-password-row">
    <Link to="/reset-password">
      Forgot Password?
    </Link>
  </div>
</div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;