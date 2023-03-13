const { PrismaClient } = require("@prisma/client");
const { IntFilter } = require("@prisma/client");
const prisma = new PrismaClient();

const postsController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await prisma.post.findMany();
      if (!posts) {
        res.status(400).json({ error: `pas d'articles tourvés` });
        return;
      }
      console.log(posts);
      res.status(200).json({ posts });
    } catch (err) {
      console.log(err);
    }
  },

  createNewPost: async (req, res) => {
    try {
      const {
        newPostTitle,
        newPostContent,
        newPostURL,
        createdBy,
        userId,
        email,
        username,
      } = req.body;
      const result = await prisma.post.create({
        data: {
          title: newPostTitle,
          content: newPostContent,
          picture: newPostURL,
          authorId: userId,
          author: {
            connect: {
              id: userId,
              email,
            },
          },
        },
      });
      res.json(result);
    } catch (err) {
      console.log(err);
    }
  },

  getAllPostsFromUser: async (req, res) => {
    const { id } = req.params;
    console.log(req.params.id);
    const userIdToInt = parseInt(id);
    console.log(userIdToInt);
    try {
      const postsUser = await prisma.post.findMany({
        where: {
          authorId: {
            equals: userIdToInt,
          },
        },
      });
      if (!postsUser) {
        console.log("Pas de posts trouvés pour cet user " + userId);
        return;
      }
      res.status(200).json({ postsUser });
      return;
    } catch (err) {
      console.error(err);
    }
  },

  deleteOneUserPost: async (req, res) => {
    const articleId = req.params.id;
    console.log(articleId);
    try {
      const deletePost = await prisma.post.delete({
        where: {
          id: parseInt(articleId, 10),
        },
      });
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
        return;
      }
      res.status(200).json({
        success: "Le post a été supprimé",
      });
      return;
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },

  getOneArticle: async (req, res) => {
    try {
      const articleId = req.params.id;

      const post = await prisma.post.findUnique({
        where: {
          id: parseInt(articleId, 10),
        },
      });
      if (!post) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
      }
      console.log(post);
      res.status(200).json({ post, success: "Article trouvé" });
      return;
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },
};

module.exports = postsController;
