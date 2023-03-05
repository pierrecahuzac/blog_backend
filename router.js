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
router.get("/api/blog/user/:userId", postsController.getAllPostsFromUser);
router.post("/api/user/createNewPost", postsController.createNewPost);
router.delete("/api/user/:articleId", postsController.deleteOneUserPost);
router.get("/api/blog/:id", postsController.getOneArticle);

router.delete("/user/:userId/deleteAccount", userController.deleteAccount);

module.exports = router;
