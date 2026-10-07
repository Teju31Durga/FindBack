import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback
} from 'react';

import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved login information
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    const {
      token: receivedToken,
      user: receivedUser
    } = response.data;

    localStorage.setItem('token', receivedToken);
    localStorage.setItem(
      'user',
      JSON.stringify(receivedUser)
    );

    setToken(receivedToken);
    setUser(receivedUser);

    return response.data;
  }, []);

  // REGISTER
  const register = useCallback(async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password
    });

    const {
      token: receivedToken,
      user: receivedUser
    } = response.data;

    localStorage.setItem('token', receivedToken);
    localStorage.setItem(
      'user',
      JSON.stringify(receivedUser)
    );

    setToken(receivedToken);
    setUser(receivedUser);

    return response.data;
  }, []);

  // UPDATE PROFILE
  const updateProfile = useCallback(async (profileData) => {
    const response = await api.put(
      '/auth/profile',
      profileData
    );

    const {
      token: receivedToken,
      user: receivedUser
    } = response.data;

    // Update token if backend sends a new one
    if (receivedToken) {
      localStorage.setItem(
        'token',
        receivedToken
      );

      setToken(receivedToken);
    }

    // Update user information
    localStorage.setItem(
      'user',
      JSON.stringify(receivedUser)
    );

    setUser(receivedUser);

    return response.data;
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    updateProfile,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};

export default AuthContext;