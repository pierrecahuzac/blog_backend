const path = require("path");
const router = require("express").Router();
const auth_router = require("./authRouter");
const checkTokenMiddleware = require("./jsonwebtoken/check");
const userController = require("./controller/userController");
const postsController = require("./controller/postsController");
/* router.use((req, res, next) => {
  const event = new Date();
  console.log("route time", event.toString());
  next();
}); */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
router.get("/api/blog", postsController.getAllPosts);
router.get("/api/users", checkTokenMiddleware, userController.getAllUsers);
router.post("/api/user/create_user", userController.createUser);
router.post("/api/user/login", userController.login);
/* router.post("/auth/login", auth_router); */
router.get("/api/blog/user/:id", postsController.getAllPostsFromUser);
router.post("/api/user/createNewPost", postsController.createNewPost);
router.delete("/api/post/:articleId", postsController.deleteOneUserPost);
router.get("/api/blog/:id", postsController.getOneArticle);

router.delete("/api/user/:userId/deleteAccount", userController.deleteAccount);

module.exports = router;
