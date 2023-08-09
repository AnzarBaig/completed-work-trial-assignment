import { Router } from "express";
import { recognitionsRoute } from "routes";

export const router = Router();

router.use("/recognitionwall", recognitionsRoute);
