const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");

const Airtable = require("../config/api");
require("dotenv").config();
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

const base = new Airtable({
  apiKey: AIRTABLE_API_KEY,
}).base(AIRTABLE_BASE_ID);

const userController = {
  deleteAccount: async (req, res) => {
    const { userId } = req.params;

    try {
      base("user").destroy([userId], (err, deletedRecords) => {
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
        return res.status(500).json({ message: "l'email n'est pas un email" });
      }
      base("user")
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

      base("user").select({
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
                "email existant, veuillez-vous connecter avec votre compte",
            });
          }
        };

      if (
        !password ||
        !password_validation ||
        password !== password_validation
      ) {
        return res.status(500).json({
          erreur: "Pas de mots de passe / mots de passe sont différents",
        });
      }
      if (!email) {
        return res.status(400).json({ erreur: "Pas d'email" });
      }
      base("user").create(
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
