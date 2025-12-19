const express = require('express');
const router = express.Router();

const Purchase = require('../models/purchase');
const verifyToken = require('../middleware/verify-token');

router.post('/:bookId', verifyToken, async (req, res) => {
  try {
    const purchase = await Purchase.create({
      user_id: req.user._id,
      book_id: req.params.bookId,
      status: req.body.status || 'demo',
    });

    res.status(201).json(purchase);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ err: 'You already purchased this book' });
    }
    res.status(400).json({ err: err.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const purchases = await Purchase.find({ user_id: req.user._id })
      .populate('book_id')
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/check/:bookId', verifyToken, async (req, res) => {
  try {
    const exists = await Purchase.findOne({
      user_id: req.user._id,
      book_id: req.params.bookId,
    });

    res.json({ purchased: !!exists });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
