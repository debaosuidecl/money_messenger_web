async function bulksetintomap(mapname, mapofiddata, redis) {
  return new Promise(async (resolve, reject) => {
    redis.hmset(mapname, mapofiddata, (err, reply) => {
      if (err) {
        // console.log(err);
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

module.exports = bulksetintomap;
