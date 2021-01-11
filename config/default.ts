require('dotenv').config();

const config = {
  port: 3003,
  mongodb: {
    url: "MONGO_URL"
  },
  redis: {
    url: "REDIS_URL"
  }
};

export type Config = DeepPartial<typeof config>;
export default config;
