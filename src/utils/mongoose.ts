import mongoose from "mongoose";
import { logger } from "./logger";
import { Config } from "../../config/default";

let connected = false;
let client;
export const registerMongoose = async (opts?: Config["mongodb"]) => {
  if (connected && client) {
    return client;
  }
  try {
    await mongoose.connect(opts.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    const db = mongoose.connection;
    logger.info("Connected to DB");
    connected = true;
    client = db;
    return db;
  } catch (error) {
    logger.error("connection error:", error);
    connected = false;
    client = null;
    throw error;
  }
};
