const dotenv = require("dotenv");
const session = require("express-session");
const express = require("express");
const router = require("./router");
var cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const cors = require("cors");
dotenv.config();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost",
    "http://app.localhost",
    "*",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session cookie
/* app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { keys: ["key1", "key2"], maxAge: 1000 * 60 * 60 * 24 * 30 },
  })
) */

app.set("trust proxy", 1); //delete on production

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* app.use("/auth", auth_router); */
app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`serveur démarré sur le port ${process.env.PORT}`);
});
