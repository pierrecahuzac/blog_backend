const dotenv = require("dotenv");
const express = require("express");
const router = require("./router");
/* const auth_router = require("./authRouter"); */
const app = express();
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* app.use("/auth", auth_router); */
app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`serveur démarré sur le port ${process.env.PORT}`);
});
