const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");
const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  var corsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
    // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
} else {
  var corsOptions = {
    origin: process.env.FRONT_PROD_URL,
    optionsSuccessStatus: 200,
    // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
}

dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`serveur démarré sur le port ${process.env.PORT}`);
});
