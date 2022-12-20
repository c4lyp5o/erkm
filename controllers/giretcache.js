const Cache = require('../models/cache');
const Stats = require('../models/stats');
const Initial = require('../models/initial');
const logger = require('../logs/logger');
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASS,
});

client.connect();

client.on('connect', (err) => {
  if (err) throw err;
  else console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.log(err);
});

const updateCacheRetrievedStats = async () => {
  const stats = await Stats.find({
    date: new Date().toISOString().slice(0, 10),
  });
  if (stats.length > 0) {
    await Stats.updateOne(
      { date: new Date().toISOString().slice(0, 10) },
      { $inc: { cacheRetrieved: 1 } }
    );
  } else {
    await Stats.create({
      date: new Date().toISOString().slice(0, 10),
      cacheRetrieved: 1,
    });
  }
  logger.info('cache retrieved');
};

const updateCacheSavedStats = async () => {
  const stats = await Stats.find({
    date: new Date().toISOString().slice(0, 10),
  });
  if (stats.length > 0) {
    await Stats.updateOne(
      { date: new Date().toISOString().slice(0, 10) },
      { $inc: { cacheSaved: 1 } }
    );
  } else {
    await Stats.create({
      date: new Date().toISOString().slice(0, 10),
      cacheSaved: 1,
    });
  }
  logger.info('cache saved');
};

const updateCacheUpdatedStats = async () => {
  const stats = await Stats.find({
    date: new Date().toISOString().slice(0, 10),
  });
  if (stats.length > 0) {
    await Stats.updateOne(
      { date: new Date().toISOString().slice(0, 10) },
      { $inc: { cacheUpdated: 1 } }
    );
  } else {
    await Stats.create({
      date: new Date().toISOString().slice(0, 10),
      cacheUpdated: 1,
    });
  }
  logger.info('cache updated');
};

const getInitialData = async (req, res) => {
  console.log('triggered get');
  const data = await Initial.find({
    name: 'current',
  });
  if (data.length > 0) {
    res.status(200).json({ data: data[0].data[0] });
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
};

const getCache = async (req, res) => {
  const { pid } = req.query;
  logger.info(`Cache requested for ${pid}`);
  const cache = await client.get(pid);
  if (cache) {
    logger.info('Cache found in redis. Sending out');
    updateCacheRetrievedStats();
    return res.status(200).json(JSON.parse(cache));
  }
  if (!cache) {
    logger.info('Cache not found in redis');
    const mongoCache = await Cache.findOne({ ic: pid });
    if (mongoCache) {
      logger.info('Cache found in mongo. Saving in redis and sending out');
      await client.set(pid, JSON.stringify(mongoCache));
      updateCacheRetrievedStats();
      return res.status(200).json(mongoCache);
    }
    if (!mongoCache) {
      logger.info('Cache not found in mongo');
      res.status(404).json({ message: 'Cache not found' });
    }
  }
};

const saveInitialData = async (req, res) => {
  console.log('triggered save');
  console.log(data);
  const initial = await Initial.create({
    name: 'current',
    data: data,
  });
  res.status(200).json(initial);
};

const saveToCache = async (req, res) => {
  console.log('triggered');
  let data;
  data = { ...req.body };
  logger.info(`Trying to save cache for ${data.ic}`);
  try {
    const cache = await client.get(data.ic);
    if (cache) {
      updateCacheUpdatedStats();
      await client.del(data.ic);
      logger.info('Cache deleted from redis');
      await Cache.deleteOne({ ic: data.ic });
      logger.info('Cache deleted from mongo');
    }
    // save cache
    await client.set(data.ic, JSON.stringify(data));
    logger.info('Cache saved in redis');
    await Cache.create(data);
    logger.info('Cache saved in mongo');
    // update stats
    updateCacheSavedStats();
    logger.info('Stats updated');
    res.status(200).json({ message: 'Cache saved' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getInitialData,
  getCache,
  saveInitialData,
  saveToCache,
};
