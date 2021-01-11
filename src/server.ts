import config from "config";
import ms from "ms";
import debug from "debug";
import logger from "./utils/logger";
import { Application } from "express";
import { registerApp } from "./app";

export const startServer = async () => {
  const PORT = config.get<number | string>("port");
  const app: Application = await registerApp();
  return new Promise((resolve, reject) => {
    const id = setTimeout(reject, ms("3s"));
    app.listen(PORT, function() {
      console.log(`Rest Server listening on port ${PORT}!`);
      resolve(PORT);
    });
  });
};
