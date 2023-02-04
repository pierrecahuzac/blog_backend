const bcrypt = require("bcrypt");

const Airtable = require("../config/api");
require("dotenv").config();
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

const base = new Airtable({
  apiKey: AIRTABLE_API_KEY,
}).base(AIRTABLE_BASE_ID);

const userController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // errors
      await base("user")
        .select({
          filterByFormula: `email = "${email}"`,
        })
        .eachPage((err, record) => {
          if (err) {
            /*   console.log(err); */
            return res.status(500).json({ erreur: `il y'a une erreur ici` });
          }
          if (!record) {
            return res.status(500).json({ erreur: "utilsateur introuvable" });
          }
          if (record) {
            console.log(record.password);
            console.log("user find");
            /*  console.log(record); */
            bcrypt.compare((password, record.password), (err, result) => {
              if (err) {
                return console.log(`il y'a une erreur`);
              }
              if (!result) {
                console.log("utilisateur inconnu");
                return;
              }
              if (result) {
                console.log("utilisateur trouvé");
                return res.status(200).json({
                  user: {
                    email: record.email,
                    display_name: record.display_name,
                  },
                });
              }
            });
            return res.status(500).json({
              erreur:
                "email existant, veuillez-vous connecter avec votre compte",
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  },

  addUser: async (req, res) => {
    // bcrypt config
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);

    try {
      const { email, display_name, password, password_validation } = req.body;
      console.log(req.body);

      base("user").select({
        filterByFormula: `email = "${email}"`,
      }),
        (err, records) => {
          if (err) {
            console.log(err);
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
          erreur: "pas de mots de passe / mots de passe sont différents",
        });
      }
      if (!email) {
        return res.status(400).json({ erreur: "pas d'email" });
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
            console.log(record);
            console.log({
              id: record.id,
              email: record.fields.email,
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
