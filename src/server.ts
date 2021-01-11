import config from "config";
import ms from "ms";
import { logger } from "./utils/logger";
import { Application } from "express";
import { registerApp } from "./app";
import chalk from "chalk";

export const startServer = async () => {
  const PORT = config.get<number | string>("port");
  const app: Application = await registerApp();
  return new Promise((resolve, reject) => {
    const id = setTimeout(reject, ms("3s"));
    app.listen(PORT, function() {
      clearTimeout(id);
      logger.info(chalk.blue.bold`Rest Server listening on port ${PORT}!`);
      resolve(PORT);
    });
  });
};
