require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const exerciseRoutes = require('./routes/exercises');
const foodSuggestionRoutes = require('./routes/foodSuggestions');
const productRoutes = require('./routes/products');

const app = express();
const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitgym';

mongoose.set('sanitizeFilter', true);

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin: parseOrigins(process.env.CLIENT_ORIGIN || 'http://localhost:4200'),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', stack: 'MEAN', database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting' });
});

app.use('/api/users', userRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/food-suggestions', foodSuggestionRoutes);
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with that unique value already exists.' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === 'MulterError') {
    return res.status(400).json({ message: error.message });
  }

  const status = error.status || 500;
  return res.status(status).json({ message: status >= 500 ? 'Unexpected server error' : error.message });
});

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`3D Fit Gym API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

function parseOrigins(value) {
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}
