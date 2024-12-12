import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  DATABASE_URL: str({
    devDefault: testOnly(
      "postgresql://postgres.lrifsqrbwelltffuxftg:chanh013@@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
    ),
  }),
  JWT_SECRET: str({
    devDefault: testOnly("secret"),
  }),
  JWT_EXPIRATION: str({
    devDefault: testOnly("1d"),
  }),
  JWT_REFRESH_TOKEN_EXPIRATION: str({
    devDefault: testOnly("7d"),
  }),
});
