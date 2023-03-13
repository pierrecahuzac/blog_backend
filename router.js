const path = require("path");
const router = require("express").Router();
const userController = require("./controller/userController");
const postsController = require("./controller/postsController");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
router.get("/api/blog", postsController.getAllPosts);
router.post("/api/user/create_user", userController.createUser);
router.post("/api/user/login", userController.loginUser);
router.get("/api/blog/user/:id", postsController.getAllPostsFromUser);
router.post("/api/user/createNewPost", postsController.createNewPost);
router.delete("/api/user/:articleId", postsController.deleteOneUserPost);
router.get("/api/blog/:id", postsController.getOneArticle);

router.delete("/api/user/:userId/deleteAccount", userController.deleteAccount);

module.exports = router;
