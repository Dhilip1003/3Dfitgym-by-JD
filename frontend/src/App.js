import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BodyModel from './components/BodyModel';
import Exercises from './components/Exercises';
import FoodSuggestions from './components/FoodSuggestions';
import Products from './components/Products';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>💪 3D Fit Gym</h1>
          <div className="nav-links">
            <a href="/">Dashboard</a>
            <a href="/body-model">3D Model</a>
            <a href="/exercises">Exercises</a>
            <a href="/food">Food</a>
            <a href="/products">Products</a>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/body-model" element={<BodyModel />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/food" element={<FoodSuggestions />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

