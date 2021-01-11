import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { mongooseMiddleware, redisMiddleware } from "./middlewares";
import { Server } from "typescript-rest";
import { controllers } from "./controllers";
import errorHandler from "errorhandler";
import responseTime from "response-time";
// import { logger } from "./utils/logger";

export const app: Application = express();

export const registerApp = async (): Promise<Application> => {
  app.use(responseTime());
  app.use(cors());
  app.use(helmet());
  app.use(mongooseMiddleware());
  app.use(redisMiddleware());

  Server.buildServices(app, ...controllers);

  app.use(errorHandler());

  return app;
};
