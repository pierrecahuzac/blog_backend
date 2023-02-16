const db = require("../config/db");
const axios = require("axios");

const postsController = {
  createNewPost: async (req, res) => {
    const { newPostTitle, newPostContent, newPostURL, userExist } = req.body;
    try {
      db("article").create(
        [
          {
            fields: {
              title: newPostTitle,
              content: newPostContent,
              picture: [{ url: newPostURL }],
              /*     createdBy: createNewPost.createdBy, */
              /*      user: userExist.display_name,
              date: createNewPost.Date, */
            },
          },
        ],
        (err, records) => {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach((record) => {
            console.log(record);
            res.status(200).json({
              record,
            });
          });
        }
      );
    } catch (err) {
      console.log(err);
    }
  },

  getAllPostsFromUser: async (req, res) => {
    const { displayName } = req.params;
    try {
      db("article")
        .select({
          filterByFormula: `{user} = '${displayName}'`,
        })
        .eachPage(
          (records, fetchNextPage) => {
            const recordsData = [];

            records.forEach((record) => {
              recordsData.push(record);
            });

            res.json({
              result: recordsData,
            });

            fetchNextPage();
          },
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: err });
            }
          }
        );
    } catch (err) {
      console.error(err, "ici");
    }
  },
  deleteOneUserPost: async (req, res) => {
    try {
      const articleId = req.params.id;
      await db("article").destroy(articleId, (err, result) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        return res.status(200).json({ article: result });
      });
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },
  getOneArticle: async (req, res) => {
    try {
      const articleId = req.params.id;
      await db("article").find(articleId, (err, result) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        return res.status(200).json({ article: result });
      });
    } catch (err) {
      return res.status(400).json({ error: err });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const posts = await axios.get(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Article`,
        {
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          },
        }
      );
      const response = await posts.data.records;
      return res.status(200).json(response).end();
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = postsController;
