import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');

  const createUser = async () => {
    const newUser = {
      username: 'user1',
      email: 'user@example.com',
      password: 'password123',
      fitnessGoals: ['weight-loss', 'muscle-gain']
    };
    try {
      const res = await axios.post(`${API_URL}/users`, newUser);
      setUser(res.data);
      setUserId(res.data.id);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome to 3D Fit Gym Platform</p>
        <button className="btn btn-primary" onClick={createUser}>
          Create Test User
        </button>
        {user && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

