import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { mongooseMiddleware, redisMiddleware } from "./middlewares";
import { Server } from "typescript-rest";
import { controllers } from "./controllers";

export const app: Application = express();

export const registerApp = async (): Promise<Application> => {
  app.use(cors);
  app.use(helmet);
  app.use(mongooseMiddleware);
  app.use(redisMiddleware);

  Server.buildServices(app, ...controllers);

  return app;
};
