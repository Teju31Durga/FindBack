import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemList from './pages/ItemList';
import ItemDetail from './pages/ItemDetail';
import ReportItem from './pages/ReportItem';
import MyReports from './pages/MyReports';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import EditProfile from './pages/EditProfile';
import ResetPassword from './pages/ResetPassword';

function App() {
  const { token } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route
  path="/login"
  element={token ? <Navigate to="/" replace /> : <Login />}
/>

<Route
  path="/register"
  element={token ? <Navigate to="/" replace /> : <Register />}
/>
<Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/:id" element={<ItemDetail />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/report" element={<ReportItem />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<EditProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
