import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function BodyModel() {
  const [userId, setUserId] = useState('');
  const [bodyMetrics, setBodyMetrics] = useState({
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    shoulders: ''
  });

  const updateBodyModel = async () => {
    if (!userId) {
      alert('Please enter User ID');
      return;
    }

    const bodyModel = {
      modelUrl: 'https://example.com/3d-model/' + userId,
      metrics: {
        chest: parseFloat(bodyMetrics.chest),
        waist: parseFloat(bodyMetrics.waist),
        hips: parseFloat(bodyMetrics.hips),
        arms: parseFloat(bodyMetrics.arms),
        thighs: parseFloat(bodyMetrics.thighs),
        shoulders: parseFloat(bodyMetrics.shoulders)
      }
    };

    try {
      const res = await axios.put(`${API_URL}/users/${userId}/body-model`, bodyModel);
      alert('Body model updated successfully!');
      console.log(res.data);
    } catch (error) {
      console.error('Error updating body model:', error);
      alert('Error updating body model');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>3D Body Model Update</h2>
        <p>Upload your photo to update 3D body model measurements</p>
        
        <div className="form-group">
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
          />
        </div>

        <h3>Body Measurements (inches)</h3>
        {Object.keys(bodyMetrics).map((key) => (
          <div className="form-group" key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="number"
              value={bodyMetrics[key]}
              onChange={(e) => setBodyMetrics({...bodyMetrics, [key]: e.target.value})}
              placeholder={`Enter ${key} measurement`}
            />
          </div>
        ))}

        <button className="btn btn-primary" onClick={updateBodyModel}>
          Update 3D Model
        </button>
      </div>
    </div>
  );
}

export default BodyModel;

