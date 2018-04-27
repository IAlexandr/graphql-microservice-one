import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const options = {
  port: 32768,
  retryStrategy: options => {
    return Math.max(options * 100, 3000);
  },
  showFriendlyErrorStack: process.env.NODE_ENV !== 'production',
};
const redis = new Redis(options);

redis.on('connect', () => {
  console.log('Redis connection port', options.port);
});
redis.on('error', error => {
  console.log('Redis connection error', error);
});

const pubsub = new RedisPubSub({
  publisher: redis,
  subscriber: redis,
});

module.exports = pubsub;
