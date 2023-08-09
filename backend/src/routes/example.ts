import { getRecognitionData } from "controllers/example";
import { Router } from "express";

export const recognitionsRoute = Router();

recognitionsRoute.get("/", getRecognitionData);
