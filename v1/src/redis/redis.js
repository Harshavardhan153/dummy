const redis = require('redis');

const logger = require('../logger/logger');
const config = require('config');

const REDIS_PORT = config.get('redis.port');

const client = redis.createClient(REDIS_PORT);

client.on('connect', () => {
    logger.log('info',`connected to Redis-server on ${REDIS_PORT}`);
});

module.exports = client;