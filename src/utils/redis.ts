import redis from "redis";
import bluebird from "bluebird";

bluebird.promisifyAll(redis);

export const registerRedis = async (opts?: any) => {
  let connected = false;
  let client;

  return connected && client
    ? client
    : new Promise((resolve, reject) => {
        const rClient = redis.createClient(opts);

        rClient.on("error", function(error) {
          console.error(error);
          connected = false;
          client = null;
          reject(error);
        });

        rClient.on("ready", () => {
          console.log("Connected to redis");
          connected = true;
          client = rClient;
          resolve(rClient);
        });
      });
};
