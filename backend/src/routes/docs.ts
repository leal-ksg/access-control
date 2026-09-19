import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import openApiDocument from "../docs/openapi.json"

export const docsRouter = Router();

docsRouter.use("/", swaggerUi.serve, swaggerUi.setup(openApiDocument));
