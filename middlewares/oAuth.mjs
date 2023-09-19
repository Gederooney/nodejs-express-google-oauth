import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const isAuthenticated = (req, res, next) => {
  const { access_token } = req.cookies;

  console.log(req.get("Referrer"));

  if (!access_token && req.path !== "/") {
    return res.redirect("/");
  }
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.path === "/") return res.redirect("/dashboard");
    return next();
  } catch (err) {
    return res.redirect("/");
  }
};
