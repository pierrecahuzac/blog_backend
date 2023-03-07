const dotenv = require("dotenv");
const express = require("express");
const router = require("./router");
const app = express();
const cors = require("cors");

/* const whiteListOrigin = [
  /*   process.env.CLIENT_URL,
  process.env.FRONT_PROD_URL, 
  "*",
];
 */
// cors management
/* var corsOptions = {
  origin: whiteListOrigin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false,
  credentials: true,
};
 */
dotenv.config();
/* app.use(cors({ origin: "*" })); */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://monblog-frontend.netlify.app"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`serveur démarré sur le port ${process.env.PORT}`);
});
