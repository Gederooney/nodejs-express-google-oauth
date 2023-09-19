import express from "express";
import auth from "./routes/oAuth.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

const PORT = process.env.PORT || 8080;

const app = express();

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     saveUninitialized: true,
//     cookie: {
//       secure: false,
//       maxAge: 1000 * 60 * 60,
//       sameSite: "strict",
//       httpOnly: true,
//     },
//     resave: false,
//   }),
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static("public"));

app.use("/oauth", auth);
app.use("/", routes);

// not found
app.use((req, res) => {
  res.status(404).send("Not found");
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal server error");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
