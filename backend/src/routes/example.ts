import { getRecognitionData } from "controllers/example";
import { Router } from "express";
import { search } from "controllers/example/search";
export const recognitionsRoute = Router();

recognitionsRoute.get("/", getRecognitionData);
recognitionsRoute.get("/search", search);
