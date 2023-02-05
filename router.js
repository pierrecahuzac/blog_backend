const path = require("path");
const router = require("express").Router();
const userController = require("./controller/userController");
const postsController = require("./controller/postsController");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
router.get("/blog", postsController.getAllPosts);
router.get("/blog/:id", postsController.getOneArticle);
router.post("/user/create_user", userController.createUser);
router.post("/user/login", userController.loginUser);
router.delete("/user/:userId/deleteAccount", userController.deleteAccount);

module.exports = router;
