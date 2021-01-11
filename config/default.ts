require('dotenv').config();

const config = {
  port: 3003,
  mongodb: {
    url: "mongo://localhost/crawl-amazon"
  },
  redis: {
    url: "redis://localhost"
  }
};

declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Config = DeepPartial<typeof config>;
export default config;
