const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const tokenManager = require("../jsonwebtoken/tokenManager");
const nodemailer = require("nodemailer");

require("dotenv").config();

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
      console.log("users", users);
      res.status(200).json({ users });
    } catch (e) {
      console.log(e);
    }
  },
  createUser: async (req, res) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.forwardemail.net",
      port: 465,
      secure: true,
      auth: {
        // should be replaced with real sender's account
      },
    });
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

      const userEmailExist = await prisma.user.findUnique({
        where: { email },
      });
      const userUsernameExist = await prisma.user.findUnique({
        where: { username },
      });

      if (userEmailExist || userUsernameExist) {
        console.log("user existant");
        res.status(502).json({
          error:
            "Utilisateur existant, merci de vous connecter avec votre email / mot de passe",
        });
        return;
      }

      if (!schema.validate(password)) {
        arrayErrors.push("error");
        res.status(400).json({
          error:
            "Le mot de passe ne correspond pas aux standards de sécurité, merci de le modifier",
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
        res.status(500).json({ arrayErrors: arrayErrors });
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
      res.status(201).json({
        user,
        logged: false,
        success: "Le compte a été crée avec succès",
        verifiedAccount: false,
      });
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      // Validation des données reçues
      if (!email || !password) {
        return res.status(401).json({ message: "Bad email or password" });
      }

      // récupérer l'utilisateur
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      console.log(user);
      if (!user) {
        console.log("utilisateur introuvable");
        return res.status(404).json({ message: "User not found" });
      }

      // vérifier que le mot de passe entré correspond à celui de la BDD
      const passwordChecked = bcrypt.compareSync(password, user.password);

      // si mot de passe différent de celui de la bdd
      if (!passwordChecked) {
        return res.status(500).json({ message: `Bad password` });
      }
      if (user && passwordChecked) {
        //  generation de la session

        /*   const sessionUser = (req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
         session: req.sessionID,
          cookies: { name: "test" }, 
        });
*/
        /*   delete req.session.user.password; */
        //console.log("req.session.user", req.session.user);
        /* .json({
          logged: true,
          info: req.session.user,
        }); */
        /* 

        */

        // generation du token jwt
        // jwt.sign({payload}, secret, durée);

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 60 * 60 * 24 * 7,
          }
        );

        /* tokenManager.createdToken(
          user.id,
          user.username,
          user.email
        ); */

        return res.status(201).json({
          userId: user.id,
          email: user.email,
          username: user.username,
          access_token: token,
          message: `${user.username} est connecté`,
          logged: true,
          token,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Database error",
        err,
      });
    }
  },

  isLogged: async (req, res) => {
    try {
      console.log(req.headers.authorization);
      if (req.headers.authorization) {
        res.status(201).json({
          logged: true,
        });
      } else {
        res.status(401).json({
          logged: false,
        });
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },
  logout: async (req, res) => {
    try {
      req.session.destroy(() => {
        res.redirect("/");
      });
      res.status(200).json({ message: "Vous êtes déconnecté" });
    } catch (err) {
      res.status(401).json({
        message: "Une erreur s'est produite lors de la déconnexion",
        err,
      });
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
        return res.status(400).json({ error: "Utilisateur introuvable" });
      }
      res.status(202).json({ success: "Le compte utilisateur a été effacé" });
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
