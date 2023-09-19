import { config } from "dotenv";
import axios from "axios";
import qs from "qs";
import jwt from "jsonwebtoken";

config();

export const getGoogleUrl = (from) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    client_id: process.env.GOOGLE_OAUTH_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    state: from,
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};

export const getGoogleOauthToken = async (code) => {
  const rootURl = "https://oauth2.googleapis.com/token";

  const options = {
    code,
    client_id: process.env.GOOGLE_OAUTH_ID,
    client_secret: process.env.GOOGLE_OAUTH_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    grant_type: "authorization_code",
  };
  try {
    const { data } = await axios.post(rootURl, qs.stringify(options), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return data;
  } catch (err) {
    console.log("Failed to fetch Google Oauth Tokens");
    throw new Error(err);
  }
};

export const getGoogleUserInfo = async (id_token, access_token) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    );

    return data;
  } catch (err) {
    console.log(err);
    throw Error(err);
  }
};

export const generateAccessToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });
  return token;
};
