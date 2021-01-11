import mongoose from "mongoose";
import bluebird from "bluebird";
import { logger } from "./logger";

export const registerMongoose = async (opts?: any) => {
  let connected = false;
  let client;

  return connected && client
    ? client
    : new Promise(async (resolve, reject) => {
        await mongoose.connect(opts, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
          promiseLibrary: bluebird
        });

        const db = mongoose.connection;

        db.on("error", msg => {
          console.error.bind(console, "connection error:", msg);
          connected = false;
          client = null;
          reject(msg);
        });

        db.once("open", function() {
          // we're connected!
          logger.info("Connected to DB");
          connected = true;
          client = db;
          resolve(db);
        });
      });
};
