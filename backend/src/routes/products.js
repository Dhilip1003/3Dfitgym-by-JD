const express = require('express');
const Product = require('../models/Product');
const { pick, requireObjectId } = require('../utils/request');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await Product.find());
  } catch (error) {
    next(error);
  }
});

router.get('/category/:category', async (req, res, next) => {
  try {
    res.json(await Product.find({ category: req.params.category }));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireObjectId, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await Product.create(productPayload(req.body)));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireObjectId, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, productPayload(req.body), { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireObjectId, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

function productPayload(body) {
  return pick(body, ['name', 'description', 'price', 'category', 'imageUrl', 'stock', 'status']);
}

module.exports = router;
