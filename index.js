const dotenv = require("dotenv");
const express = require("express");
const router = require("./router");
const app = express();
const cors = require("cors");

const whiteListOrigin = [
  /*   process.env.CLIENT_URL,
  process.env.FRONT_PROD_URL, */
  "*",
];

// cors management
var corsOptions = {
  origin: whiteListOrigin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false,
  credentials: true,
};

dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", whiteListOrigin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
}); */

app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`serveur démarré sur le port ${process.env.PORT}`);
});
