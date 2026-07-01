const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const { isSafeUrl, parseNumber, pick, requireObjectId } = require('../utils/request');

const router = express.Router();
const uploadDir = path.join(process.cwd(), 'uploads', 'body-models');
const uploadMaxFileSizeMb = Number(process.env.UPLOAD_MAX_FILE_SIZE_MB || 50);
const uploadMaxFiles = Number(process.env.UPLOAD_MAX_FILES || 8);
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm'
]);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.webm']);

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
  limits: { fileSize: uploadMaxFileSizeMb * 1024 * 1024, files: uploadMaxFiles },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(ext);
    cb(allowed ? null : new Error('Only image and video files are supported.'), allowed);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(pick(req.body, ['username', 'email', 'password', 'fitnessGoals']));
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireObjectId, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/body-model', requireObjectId, async (req, res, next) => {
  try {
    const bodyModel = buildBodyModel(req.body);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        bodyModel
      },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/body-model/reconstruct', requireObjectId, upload.array('captures', uploadMaxFiles), async (req, res, next) => {
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
      modelUrl: `/models/pending-${userId}.glb`,
      provider: 'local-placeholder',
      status: 'pending'
    };
  }

  const reconstructionUrl = new URL(process.env.RECONSTRUCTION_API_URL);
  if (!['http:', 'https:'].includes(reconstructionUrl.protocol)) {
    const error = new Error('RECONSTRUCTION_API_URL must be an http(s) URL.');
    error.status = 500;
    throw error;
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

  const modelUrl = response.data.modelUrl || response.data.url;
  if (!isSafeUrl(modelUrl)) {
    const error = new Error('Reconstruction provider returned an invalid model URL.');
    error.status = 502;
    throw error;
  }

  return {
    modelUrl,
    provider: response.data.provider || 'third-party',
    status: response.data.status || 'completed'
  };
}

function buildBodyModel(body) {
  const payload = pick(body, ['modelUrl', 'reconstructionProvider', 'reconstructionStatus']);
  if (!isSafeUrl(payload.modelUrl)) {
    const error = new Error('modelUrl must be an http(s) or local path URL.');
    error.status = 400;
    throw error;
  }

  return {
    ...payload,
    reconstructionStatus: payload.reconstructionStatus || 'manual',
    metrics: parseMetrics(body.metrics || body),
    lastUpdated: new Date()
  };
}

function parseMetrics(body) {
  const metrics = {};
  ['chest', 'waist', 'hips', 'arms', 'thighs', 'shoulders'].forEach((key) => {
    const value = parseNumber(body[key]);
    if (value !== undefined) metrics[key] = value;
  });
  return metrics;
}

module.exports = router;
