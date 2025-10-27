const Redis = require('ioredis');
const client = new Redis({
  host: '127.0.0.1',  // your Redis host
  port: 6379,         // default Redis port
  // password: 'yourpassword'  // uncomment if your Redis needs auth
});

client.on('connect', () => {
  console.log('✅ Connected to Redis');
});

client.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

module.exports = client;
