const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { IntFilter } = require("@prisma/client");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userController = {
  createUser: async (req, res) => {
    console.log("ici");
    try {
      const { email, username, password, password_validation } = req.body;
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
        res.status(502).json({
          error:
            "Utilisateur existant, merci de vous connecter avec votre email / mot de passe",
        });
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
      res
        .status(201)
        .json({ user, sucess: "Le compte a été crée avec succès" });
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!emailValidator.validate(email)) {
        return res.status(401).json({ message: "L'email n'est pas un email" });
      }
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        res
          .status(404)
          .json({ error: "Utilisateur introuvable, avez-vous un compte ?" });
        console.log("user not found");
        return;
      }
      const passwordChecked = bcrypt.compareSync(password, user.password);
      if (!passwordChecked) {
        res.status(401).json({ error: `Mauvais mot de passe` });
        return;
      }
      /* const token = jwt.sign({ userId: user.id }, JWT_SIGN_SECRET);
      res.cookie("token", token, { httpOnly: true }); */
      res
        .status(200)
        .json({ user, sucess: "Utilisateur connecté avec succès" });
    } catch (err) {
      console.log(err);
    }
  },
  deleteAccount: async (req, res) => {
    const { userId } = req.params;
    const userIdToInt = parseInt(userId);
    console.log(userIdToInt);

    console.log(userId);
    try {
      const deletePosts = prisma.post.deleteMany({
        where: {
          authorId: userIdToInt,
        },
      });

      const deleteUser = prisma.user.delete({
        where: {
          id: userIdToInt,
        },
      });

      await prisma.$transaction([deletePosts, deleteUser]);

      if (!res) {
        res.status(400).json({ error: "Utilisateur introuvable" });
        return;
      }
      res.status(202).json({ sucess: "Le compte utilisateur a été effacé" });
      return;
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Une erreur c'est produite, compte toujours actif",
      });
    }
  },
};
module.exports = userController;
