const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const db = require("../config/db");
require("dotenv").config();

const userController = {
  createUser: async (req, res) => {
    console.log("ici");
    try {
      const { email, username, password, password_validation } = req.body;
      console.log(req.body);
      var schema = new passwordValidator();
      schema
        .is()
        .min(8) // Minimum length 8
        .is()
        .max(100) // Maximum length 100
        .has()
        .uppercase() // Must have uppercase letters
        .has()
        .lowercase() // Must have lowercase letters
        .has()
        .digits(2) // Must have at least 2 digits
        .has()
        .not()
        .spaces() // Should not have spaces
        .is()
        .not()
        .oneOf(["Passw0rd", "Password123"]);
      const arrayErrors = [];

      const userExist = await prisma.user.findUnique({
        where: { email },
      });

      if (userExist) {
        arrayErrors.push("error");
        console.log(userExist);
        res.status(502).json({ error: "Email found, please login" });
        return;
      }

      if (!schema.validate(password)) {
        arrayErrors.push("error");
        res.status(400).json({
          erreur:
            "Le mot de passes ne correspont pas aux standards de sécurité, merci de le modifier",
        });
        return;
      }
      if (!emailValidator.validate(email)) {
        arrayErrors.push("error");
        res.status(500).json({
          erreur: "Entrez une adresse email valide",
        });
        return;
      }
      if (
        !password ||
        !password_validation ||
        password !== password_validation
      ) {
        arrayErrors.push("error");
        res.status(500).json({
          erreur:
            "Pas de mots de passe ou le mots de passe et la validation sont différents",
        });
        return;
      }
      if (!email) {
        arrayErrors.push("error");
        res.status(400).json({ erreur: "Pas d'email" });
        return;
      }

      if (arrayErrors.length) {
        res.status(500).json({ arrayErrors });
        return;
      }
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const user = await prisma.user.create({
        data: {
          email,
          username: username,
          password: bcrypt.hashSync(password, salt),
        },
      });
      res.status(200).json({ user, success: "User created with success" });
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!emailValidator.validate(email)) {
        return res.status(500).json({ message: "L'email n'est pas un email" });
      }
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        console.log("user not found");
        return;
      }
      console.log(user);
      const passwordChecked = bcrypt.compareSync(password, user.password);
      console.log(passwordChecked);
      if (!passwordChecked) {
        res.status(402).json({ error: `Mauvais mot de passe` });
        return;
      }

      res.status(200).json({ user, success: "user find, user connected" });
      return;
    } catch (err) {
      console.log(err);
    }
  },
  deleteAccount: async (req, res) => {
    const { userId } = req.params;
    try {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
      if (err) {
        console.log(err);
      }
      res.status(200).json({ success: "User account deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Une erreur c'est produite, compte toujours actif",
      });
    }
  },
};
module.exports = userController;
