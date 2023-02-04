const path = require("path");
const router = require("express").Router();
const userController = require("./controller/userController");
const postsController = require("./controller/postsController");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
router.get("/blog", postsController.getAllPosts);
router.post("/user/add", userController.addUser);
router.post("/user/login", userController.loginUser);

module.exports = router;

/* base("user").select({
  filterByFormula: `email = "${email}"`,
}),
  (err, records) => {
    if (err) {
      console.log(err);
    }
    if (records) {
      console.log("ici");
      return res
        .status(500)
        .json({
          erreur: "email existant, veuillez-vous connecter avec votre compte",
        })
        .end();
    }
  }; */
