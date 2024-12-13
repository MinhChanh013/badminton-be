import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { connectDatabase } from "./config/database";
import { playerRouter } from "./api/payler/playerRouter";
import { authRouter } from "./api/auth/authRouter";
import { courtRouter } from "./api/court/courtRouter";
import { discountRouter } from "./api/discount/discountRouter";
import { expensesRouter } from "./api/expenses/expensesRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Connect to the database
connectDatabase();

// Routes
app.use("/auth", authRouter);
app.use("/players", playerRouter);
app.use("/courts", courtRouter);
app.use("/discounts", discountRouter);
app.use("/expenses", expensesRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
