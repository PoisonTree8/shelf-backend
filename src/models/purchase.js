const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    status: {
      type: String,
      enum: ['demo', 'paid'],
      default: 'demo',
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

purchaseSchema.index({ user_id: 1, book_id: 1 }, { unique: true });

module.exports = mongoose.model('Purchase', purchaseSchema);




