const express = require('express');
const router = express.Router();

const Book = require('../models/book');
const verifyToken = require('../middleware/verify-token');
const checkRole = require('../middleware/checkRole');


router.get('/', async (req, res) => {
  try {
    const { authorName, category } = req.query;

    const filter = {};
    if (authorName) filter.authorName = authorName;
    if (category) filter.category = category;

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ err: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});


router.put('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ err: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ err: 'Book not found' });
    }

    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
