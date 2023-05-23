const { PrismaClient } = require("@prisma/client");
const { IntFilter } = require("@prisma/client");
const { post } = require("../router");
const prisma = new PrismaClient();

const postsController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          title: true,
          content: true,
          published: true,
          picture: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      if (!posts) {
        res.status(400).json({ error: `pas d'articles tourvés` });
        return;
      }

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
    const userId = parseInt(id);
    try {
      const postsUser = await prisma.post.findMany({
        where: {
          authorId: userId,
          /*   author: {
            select: {
              username: true,
              email: true,
            },
          }, */
        },
      });

      if (!postsUser) {
        return;
      }

      res.status(201).json({ postsUser });
      return;
    } catch (err) {
      console.error(err);
    }
  },

  deleteOnePost: async (req, res) => {
    const { articleId } = req.params;

    const id = parseInt(articleId);
    console.log(typeof id);
    try {
      await prisma.post.delete({
        where: {
          id: id,
        },
      });

      if (err) {
        console.log(err);
        return res.status(500).json({ error: err });
      }
      console.log("ici");
      return res.status(201).json({
        success: "Le post a été supprimé",
      });
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
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          title: true,
          content: true,
          published: true,
          picture: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      if (!post) {
        res.status(404).json({ error: "Article non trouvé" });
        return;
      }
      res.status(200).json({ post, success: "Article trouvé" });
      return;
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },
};

module.exports = postsController;
