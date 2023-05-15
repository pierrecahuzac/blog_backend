const { PrismaClient } = require("@prisma/client");
const { IntFilter } = require("@prisma/client");
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
      /*   console.log(posts); */
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
      /* console.log(postsUser); */
      if (!postsUser) {
        /*       console.log("Pas de posts trouvés pour cet user " + userId); */
        return;
      }
      /*  console.log(postsUser); */
      res.status(201).json({ postsUser });
      return;
    } catch (err) {
      console.error(err);
    }
  },

  deleteOneUserPost: async (req, res) => {
    const { articleId } = req.params;
    console.log(typeof articleId);
    const id = parseInt(articleId);

    try {
      const deletePostByID = prisma.post.delete({
        where: {
          id: id,
        },
      });
      console.log(deletePostByID);
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
        return;
      }
      res.status(201).json({
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
      /*     console.log(post); */
      res.status(200).json({ post, success: "Article trouvé" });
      return;
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },
};

module.exports = postsController;
