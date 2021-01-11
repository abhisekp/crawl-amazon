import redis from "redis";
import bluebird from "bluebird";
import { logger } from "./logger";

bluebird.promisifyAll(redis);

let connected = false;
let client;
export const getRedisClient = async (
  opts?: any
): Promise<redis.RedisClient> => {
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
          logger.info("Connected to redis");
          connected = true;
          client = rClient;
          resolve(rClient);
        });
      });
};
