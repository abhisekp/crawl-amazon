import { registerMongoose } from "../utils/mongoose";
import config from "config";
import { Config } from "../../config/default";

export const mongooseMiddleware = () => async (req, res, next) => {
  const mConfig = config.get<Config["mongodb"]>("mongodb");
  try {
    await registerMongoose(mConfig);
  } catch (err) {}
  next();
};
