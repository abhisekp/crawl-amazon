require('dotenv').config();

const config = {
  port: 3003,
  mongodb: {
    url: ""
  },
  redis: {
    url: ""
  }
};

export type Config = DeepPartial<typeof config>;
export default config;
