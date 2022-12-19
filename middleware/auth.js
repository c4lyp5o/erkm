const Stats = require('../models/stats');
const logger = require('../logs/logger');

const updateConnectionStats = async () => {
  const stats = await Stats.find({
    date: new Date().toISOString().slice(0, 10),
  });
  if (stats.length > 0) {
    await Stats.updateOne(
      { date: new Date().toISOString().slice(0, 10) },
      { $inc: { noOfConnections: 1 } }
    );
  } else {
    await Stats.create({
      date: new Date().toISOString().slice(0, 10),
      noOfConnections: 1,
    });
  }
  logger.info('Stats updated');
};

const updateBadConnectionStats = async (ip) => {
  const stats = await Stats.find({
    date: new Date().toISOString().slice(0, 10),
  });
  if (stats.length > 0) {
    await Stats.updateOne(
      { date: new Date().toISOString().slice(0, 10) },
      { $inc: { noOfBadConnections: 1 } },
      { $push: { badIps: ip } }
    );
  } else {
    await Stats.create({
      date: new Date().toISOString().slice(0, 10),
      noOfBadConnections: 1,
      badIps: [ip],
    });
  }
  logger.info('Stats updated');
};

const auth = async (req, res, next) => {
  const authHeader = req.headers['x-api-key'];
  if (!authHeader) {
    updateBadConnectionStats(req.ip);
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  if (authHeader !== process.env.API_KEY) {
    updateBadConnectionStats(req.ip);
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  updateConnectionStats();
  next();
};

module.exports = { auth };
