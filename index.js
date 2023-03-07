const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");
const dotenv = require("dotenv");

const whiteListOrigin = [
  process.env.CLIENT_URL,
  process.env.FRONT_PROD_URL,
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

app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`serveur démarré sur le port ${process.env.PORT}`);
});
