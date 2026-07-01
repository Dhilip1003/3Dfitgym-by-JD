const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const express = require('express');
const multer = require('multer');
const User = require('../models/User');

const router = express.Router();
const uploadDir = path.join(process.cwd(), 'uploads', 'body-models');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    cb(null, `${Date.now()}-${baseName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => {
    const allowed = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    cb(allowed ? null : new Error('Only image and video files are supported.'), allowed);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/body-model', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        bodyModel: {
          ...req.body,
          reconstructionStatus: req.body.reconstructionStatus || 'manual',
          lastUpdated: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/body-model/reconstruct', upload.array('captures', 8), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!req.files?.length) return res.status(400).json({ message: 'Upload at least one image or video.' });

    const sourceFiles = req.files.map((file) => `/uploads/body-models/${file.filename}`);
    const reconstruction = await reconstructBodyModel(req.files, req.params.id);

    user.bodyModel = {
      modelUrl: reconstruction.modelUrl,
      sourceFiles,
      reconstructionProvider: reconstruction.provider,
      reconstructionStatus: reconstruction.status,
      metrics: parseMetrics(req.body),
      lastUpdated: new Date()
    };

    await user.save();
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

async function reconstructBodyModel(files, userId) {
  if (!process.env.RECONSTRUCTION_API_URL) {
    return {
      modelUrl: `/uploads/body-models/pending-${userId}.glb`,
      provider: 'local-placeholder',
      status: 'pending'
    };
  }

  const form = new FormData();
  files.forEach((file) => {
    form.append('captures', fs.createReadStream(file.path), file.originalname);
  });
  form.append('userId', userId);

  const response = await axios.post(process.env.RECONSTRUCTION_API_URL, form, {
    headers: {
      ...form.getHeaders(),
      ...(process.env.RECONSTRUCTION_API_KEY ? { Authorization: `Bearer ${process.env.RECONSTRUCTION_API_KEY}` } : {})
    },
    timeout: 120000
  });

  return {
    modelUrl: response.data.modelUrl || response.data.url,
    provider: response.data.provider || 'third-party',
    status: response.data.status || 'completed'
  };
}

function parseMetrics(body) {
  const metrics = {};
  ['chest', 'waist', 'hips', 'arms', 'thighs', 'shoulders'].forEach((key) => {
    if (body[key] !== undefined && body[key] !== '') {
      metrics[key] = Number(body[key]);
    }
  });
  return metrics;
}

module.exports = router;
