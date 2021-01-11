import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { mongooseMiddleware, redisMiddleware } from "./middlewares";
import { Server } from "typescript-rest";
import { controllers } from "./controllers";
import errorHandler from "errorhandler";
import { logger } from "./utils/logger";

export const app: Application = express();

export const registerApp = async (): Promise<Application> => {
  app.use(cors);
  app.use(helmet);
  app.use(mongooseMiddleware);
  app.use(redisMiddleware);

  Server.buildServices(app, ...controllers);

  app.use(
    errorHandler({
      log: err => logger.error(err)
    })
  );

  return app;
};
