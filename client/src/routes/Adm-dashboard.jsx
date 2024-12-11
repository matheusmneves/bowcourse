import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/adm-login');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Admin functionalities available here.</p>
    </div>
  );
}

export default AdminDashboard;