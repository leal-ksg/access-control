import * as deviceController from "../controllers/device-controller"
import { Request, Response, Router } from "express";

export const deviceRouter = Router()

deviceRouter.get("/unlinked", deviceController.getUnlinkedDevices)