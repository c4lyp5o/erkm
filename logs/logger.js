const log4js = require('log4js');

log4js.configure({
  appenders: {
    everything: {
      type: 'file',
      filename: 'logs/everything.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '%d %p %c - %m',
      },
    },
  },
  categories: {
    default: { appenders: ['everything'], level: 'info' },
  },
});

const logger = log4js.getLogger();
logger.level = 'debug';

module.exports = logger;
