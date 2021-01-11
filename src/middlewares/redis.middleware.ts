import { getRedisClient } from "../utils/redis";
import config from "config";
import { Config } from "../../config/default";

export const redisMiddleware = () => async (req, res, next) => {
  const rConfig = config.get<Config["redis"]>("redis");
  try {
    await getRedisClient(rConfig);
  } catch (err) {}
  next();
};
