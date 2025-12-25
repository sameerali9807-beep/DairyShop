const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../lib/store');
const { validateProduct } = require('../lib/validate');
const { requireAuth } = require('../lib/auth');

const router = express.Router();

// GET /api/products?search=&category=&inStock=
router.get('/', async (req, res, next) => {
  try {
    const { search, category, inStock } = req.query;
    const items = await store.getAll({ search, category, inStock });
    res.json(items);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await store.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
});

// Admin-only create
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const data = req.body;
    const { valid, errors } = validateProduct(data);
    if (!valid) return res.status(400).json({ errors });
    const now = new Date().toISOString();
    const product = {
      id: uuidv4(),
      name: data.name,
      category: data.category,
      price: Number(data.price),
      mrp: data.mrp ? Number(data.mrp) : Number(data.price),
      unit: data.unit || '1 kg',
      inStock: data.inStock == null ? true : Boolean(data.inStock),
      imageUrl: data.imageUrl || '/images/placeholder.png',
      description: data.description || '',
      updatedAt: now
    };
    await store.add(product);
    res.status(201).json(product);
  } catch (err) { next(err); }
});

// Admin update
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const patch = req.body;
    const { valid, errors } = validateProduct(patch, { partial: true });
    if (!valid) return res.status(400).json({ errors });
    const updated = await store.update(req.params.id, patch);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// Admin delete
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const ok = await store.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
