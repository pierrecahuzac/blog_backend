const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const db = require("../config/db");
require("dotenv").config();

const userController = {
  deleteAccount: async (req, res) => {
    const { userId } = req.params;

    try {
      db("user").destroy([userId], (err, deletedRecords) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Deleted", deletedRecords.length, "records");
        res.status(200).json({
          message: "Utilisateur effacé",
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Une erreur c'est produite, compte toujours actif",
      });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!emailValidator.validate(email)) {
        return res.status(500).json({ message: "L'email n'est pas un email" });
      }
      db("user")
        .select({ filterByFormula: `email="${email}"` })
        .eachPage(
          function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            records.forEach((record) => {
              console.log("Retrieved", record.get("email"));
              console.log(res);
              res.status(200).json({
                record,
                logged: true,
              });
            });

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
    } catch (err) {
      console.log(err);
    }
  },

  createUser: async (req, res) => {
    // bcrypt config
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    try {
      const { email, display_name, password, password_validation } = req.body;
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

      db("user").select({
        filterByFormula: `email="${email}"`,
      }),
        (err, records) => {
          if (err) {
            console.log(err);
            return;
          }
          if (records) {
            console.log("ici");
            return res.status(500).json({
              erreur:
                "Email existant, veuillez-vous connecter avec votre compte",
            });
          }
        };
      if (!schema.validate(password)) {
        return res.status(400).json({
          erreur:
            "Le mot de passes ne correspont pas aux standards de sécurité, merci de le modifier",
        });
      }
      if (!emailValidator.validate(email)) {
        return res.status(500).json({
          erreur: "Entrez une adresse email valide",
        });
      }
      if (
        !password ||
        !password_validation ||
        password !== password_validation
      ) {
        return res.status(500).json({
          erreur: "Pas de mots de passe ou les mots de passe sont différents",
        });
      }
      if (!email) {
        return res.status(400).json({ erreur: "Pas d'email" });
      }
      db("user").create(
        [
          {
            fields: {
              email,
              password: await bcrypt.hashSync(password, salt),
              display_name,
            },
          },
        ],
        function (err, records) {
          if (err) {
            console.log(err);
            return err;
          }
          records.forEach((record) => {
            console.log({
              id: record.id,
              email: record.fields.email,
            });
            res.status(200).json({
              email: record.fields.email,
              id: record.id,
              message: "Utilisateur créé avec succés",
            });
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
};
module.exports = userController;
