const express = require('express');
const router = express.Router();

const Rating = require('../models/rating');
const Purchase = require('../models/purchase');
const verifyToken = require('../middleware/verify-token');

// (Public - view ratings for a book)
router.get('/book/:bookId', async (req, res) => {
  try {
    const ratings = await Rating.find({ book_id: req.params.bookId })
      .populate('user_id', 'username')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//  (User - create rating, must be purchased)
router.post('/:bookId', verifyToken, async (req, res) => {
  try {
    const { ratingValue } = req.body;

    if (!ratingValue) {
      return res.status(400).json({ err: 'ratingValue is required' });
    }

    // Must have a purchase first
    const hasPurchase = await Purchase.findOne({
      user_id: req.user._id,
      book_id: req.params.bookId,
    });

    if (!hasPurchase) {
      return res.status(403).json({ err: 'You must purchase the book before rating it' });
    }

    const newRating = await Rating.create({
      ratingValue,
      user_id: req.user._id,
      book_id: req.params.bookId,
    });

    res.status(201).json(newRating);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ err: 'You already rated this book' });
    }
    res.status(400).json({ err: err.message });
  }
});

// (User - update your rating)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) return res.status(404).json({ err: 'Rating not found' });

    if (String(rating.user_id) !== String(req.user._id)) {
      return res.status(403).json({ err: 'Access denied' });
    }

    rating.ratingValue = req.body.ratingValue ?? rating.ratingValue;
    await rating.save();

    res.json(rating);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// DELETE rating
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) return res.status(404).json({ err: 'Rating not found' });

    if (String(rating.user_id) !== String(req.user._id)) {
      return res.status(403).json({ err: 'Access denied' });
    }

    await Rating.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rating deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
