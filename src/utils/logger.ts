import chalk from "chalk";
import winston from "winston";
import stripAnsi from "strip-ansi";

const jsonReplacer = (k, v) => {
  if (v.message) {
    v.message = stripAnsi(v.message) 
  }
  return v
};

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json({ replacer: jsonReplacer }),
  defaultMeta: { service: "crawl-amazon" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}
