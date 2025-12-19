const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    ratingValue: { type: Number, required: true, min: 1, max: 5 },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  },
  { timestamps: true }
);

//one rating per user per book
ratingSchema.index({ user_id: 1, book_id: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
