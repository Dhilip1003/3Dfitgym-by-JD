import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [userId, setUserId] = useState('');
  const [suggestedExercises, setSuggestedExercises] = useState([]);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const res = await axios.get(`${API_URL}/exercises`);
      setExercises(res.data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const getSuggestedExercises = async () => {
    if (!userId) {
      alert('Please enter User ID');
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/exercises/suggest/${userId}`);
      setSuggestedExercises(res.data);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Exercises</h2>
        
        <div className="form-group">
          <label>Get Personalized Exercise Suggestions:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
          />
          <button className="btn btn-primary" onClick={getSuggestedExercises} style={{ marginTop: '0.5rem' }}>
            Get Suggestions
          </button>
        </div>

        {suggestedExercises.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3>Suggested Exercises for You</h3>
            <div className="grid">
              {suggestedExercises.map((exercise) => (
                <div key={exercise.id} className="item-card">
                  <h3>{exercise.name}</h3>
                  <p>{exercise.description}</p>
                  <p><strong>Target:</strong> {exercise.targetBodyPart}</p>
                  <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
                  {exercise.videoUrl && (
                    <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer">
                      Watch Video
                    </a>
                  )}
                  {exercise.articleUrl && (
                    <a href={exercise.articleUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '1rem' }}>
                      Read Article
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <h3>All Exercises</h3>
        <div className="grid">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="item-card">
              <h3>{exercise.name}</h3>
              <p>{exercise.description}</p>
              <p><strong>Target:</strong> {exercise.targetBodyPart}</p>
              <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Exercises;

