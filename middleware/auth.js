const jwt = require('jsonwebtoken');
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

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  const userToken = authHeader.split(' ')[1];
  try {
    jwt.verify(userToken, process.env.JWT_SECRET);
    updateConnectionStats().then(() => {
      next();
    });
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};

module.exports = { auth };
