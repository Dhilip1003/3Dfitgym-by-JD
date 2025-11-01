import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Gym Products</h2>
        <p>Browse and purchase gym equipment and supplements</p>
        
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid">
            {products.map((product) => (
              <div key={product.id} className="item-card">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '1rem' }} />
                )}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p className="price">${product.price}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <button className="btn btn-primary">Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;

