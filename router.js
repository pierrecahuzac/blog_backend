const path = require("path");
const router = require("express").Router();

const checkTokenMiddleware = require("./jsonwebtoken/check");
const userController = require("./controller/userController");
const postsController = require("./controller/postsController");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
  res.status(200).json({ response: "server is working" });
});
router.get("/api/blog", postsController.getAllPosts);
router.get("/check-auth", userController.isLogged);
router.get("/api/users", checkTokenMiddleware, userController.getAllUsers);
router.post("/api/user/create_user", userController.createUser);
router.post("/api/user/login", userController.login);
router.post("/api/user/logout", userController.logout);

router.get("/api/blog/user/:id", postsController.getAllPostsFromUser);
router.post("/api/user/createNewPost", postsController.createNewPost);
router.delete(
  "/api/post/:articleId",
  /*  checkTokenMiddleware, */
  postsController.deleteOnePost
);
router.get("/api/blog/:id", postsController.getOneArticle);

router.delete(
  "/api/user/:userId/deleteAccount",
  /*  checkTokenMiddleware, */
  userController.deleteAccount
);

module.exports = router;
