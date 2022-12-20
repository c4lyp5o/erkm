const mongoose = require('mongoose');

const InitialSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'current' },
    data: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Initial', InitialSchema);
