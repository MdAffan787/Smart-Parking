const redis = require("redis");

const client = redis.createClient({
 url: process.env.REDIS_URL || "redis://localhost:6379"
});
(async () => {
 try {
  await client.connect();

  console.log("✅ Redis Connected");
 }
 catch(err){
  console.log(err);
 }
})();

module.exports = client;