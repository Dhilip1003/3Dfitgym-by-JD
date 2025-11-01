import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function FoodSuggestions() {
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [userId, setUserId] = useState('');

  const getFoodSuggestions = async () => {
    if (!userId) {
      alert('Please enter User ID');
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/food-suggestions/user/${userId}`);
      setFoodSuggestions(res.data);
    } catch (error) {
      console.error('Error getting food suggestions:', error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Food Suggestions</h2>
        <p>Get personalized food recommendations based on your fitness goals</p>
        
        <div className="form-group">
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
          />
          <button className="btn btn-primary" onClick={getFoodSuggestions} style={{ marginTop: '0.5rem' }}>
            Get Food Suggestions
          </button>
        </div>

        <div className="grid" style={{ marginTop: '1rem' }}>
          {foodSuggestions.map((food) => (
            <div key={food.id} className="item-card">
              <h3>{food.name}</h3>
              <p><strong>Meal Type:</strong> {food.mealType}</p>
              <p>{food.description}</p>
              <p><strong>Calories:</strong> {food.calories}</p>
              <p><strong>Protein:</strong> {food.protein}g</p>
              <p><strong>Carbs:</strong> {food.carbs}g</p>
              <p><strong>Fats:</strong> {food.fats}g</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FoodSuggestions;

