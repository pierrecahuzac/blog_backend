const dotenv = require("dotenv");
const express = require("express");
const router = require("./router");
const app = express();
const cors = require("cors");
dotenv.config();
/* const whiteListOrigin = [
  process.env.CLIENT_URL,
  process.env.FRONT_PROD_URL,
  "*",
]; */

// cors management
/*  var corsOptions = {
  origin: whiteListOrigin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false,
  credentials: true,
};  */

/* app.use(function (req, res, next) {
  cors({
    origin: [process.env.FRONT_PROD_URL, process.env.CLIENT_URL],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  }),
    /* res.header(
      ["Access - Control - Allow - Origin"],
      "Origin, X-Requested-With, Content-Type, Accept"
    ); 

    next();
}); */
app.use(
  cors(/* {
    origin: [process.env.FRONT_PROD_URL, process.env.CLIENT_URL],
  } */)
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`serveur démarré sur le port ${process.env.PORT}`);
});
