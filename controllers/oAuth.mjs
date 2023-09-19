import {
  getGoogleUrl,
  getGoogleOauthToken,
  getGoogleUserInfo,
  generateAccessToken,
} from "../lib/utils.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const googleAuth = (req, res, next) => {
  const from = req.get("Referrer") || "/";
  return res.redirect(getGoogleUrl(from));
};

export const googleAuthCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    const pathUrl = req.query.state || "/";

    if (!code) {
      return next(new Error("Authorization code not provided!", 401));
    }

    const { access_token, id_token } = await getGoogleOauthToken(code);

    const user = await getGoogleUserInfo(id_token, access_token);

    res.cookie("access_token", generateAccessToken(user.id), {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=/dashboard">
      </head>
      <body>
        <p>Redirecting...</p>
      </body>
    </html>
  `);
  } catch (error) {
    return next(error);
  }
};
