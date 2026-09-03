import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./database/prisma";
import { withRetry } from "./core/with-retry";
import { errorHandlerMiddleware } from "./middlewares/error-handler-middleware";

async function main() {
  dotenv.config();

  await withRetry(connectDB);

  const PORT = process.env.PORT || 3001;

  const server = express();

  server.use(cookieParser());

  server.use(cors());

  server.use(express.json());
  // server.use("/api/v1", router);

  server.use(errorHandlerMiddleware)

  server.listen(PORT, () => {
    console.log(`-> Server is running on port ${PORT}`);
  });
}

main();
