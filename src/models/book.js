const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    authorName: { type: String, required: true, trim: true },

    previewPdfUrl: { type: String, required: true, trim: true },
    fullPdfUrl: { type: String, required: true, trim: true },

    coverImageUrl: { type: String, trim: true }, 
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
