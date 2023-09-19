import { Router } from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { isAuthenticated } from "../middlewares/oAuth.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routes = Router();

routes.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../views/index.html"));
});

routes.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(join(__dirname, "../views/dashboard.html"));
});

export default routes;
