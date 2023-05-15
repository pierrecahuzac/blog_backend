const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let router = express.Router();
const login = router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validation des données reçues
  if (!email || !password) {
    return res.status(400).json({ message: "Bad email or password" });
  }
  try {
    const user = prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log("database");
    if (!user) {
      console.log("!user");
      console.log("user not found");
      return res.status(401).json({ error: "unknow user" });
    }
    const passwordChecked = bcrypt.compareSync(password, user.password);

    if (!passwordChecked) {
      console.log("!password");
      return res
        .status(500)
        .json({ message: `Login process failed`, error: err });
    }

    // generation du token jwt
    // jwt.sign({payload}, secret, durée);
    const token = jwt.sign(
      {
        id: user.id,
        name: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_DURING }
    );
    console.log(token);
    return res.json({ access_token: token });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
});

module.exports = router;
