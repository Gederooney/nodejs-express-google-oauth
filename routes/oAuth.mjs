import { Router } from "express";
import { googleAuth, googleAuthCallback } from "../controllers/oAuth.mjs";

const auth = Router();

auth.get("/google", googleAuth);

auth.get("/google/callback", googleAuthCallback);

export default auth;
