import "dotenv/config";
import "./mqtt/config";

import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from 'express-rate-limit';
import cors from "cors";

import { connectDB } from "./database/prisma";
import { withRetry } from "./core/with-retry";
import { errorHandlerMiddleware } from "./middlewares/error-handler-middleware";
import { router } from "./routes";
import { docsRouter } from "./routes/docs";
import { globalLimiter } from "./middlewares/rate-limiter";

async function main() {
  await withRetry(connectDB);

  const PORT = process.env.PORT || 3001;

  const server = express();

  server.use(cookieParser());

  server.use(cors());

  server.use(express.json());

  router.use(globalLimiter)

  server.use("/docs", docsRouter)

  server.use("/api/v1", router);

  server.use(errorHandlerMiddleware);

  server.listen(PORT, () => {
    console.log(`-> Server is running on port ${PORT}`);
  });
}

main();
