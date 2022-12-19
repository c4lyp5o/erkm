const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    cacheSaved: { type: Number, default: 0 },
    cacheRetrieved: { type: Number, default: 0 },
    cachedUpdated: { type: Number, default: 0 },
    noOfConnections: { type: Number, default: 0 },
    noOfBadConnections: { type: Number, default: 0 },
    badIps: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stats', StatsSchema);
