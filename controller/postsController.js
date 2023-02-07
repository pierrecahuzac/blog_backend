const Airtable = require("../config/api");
const axios = require("axios");
const { response } = require("express");
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;
const base = new Airtable({
  apiKey: AIRTABLE_API_KEY,
}).base(AIRTABLE_BASE_ID);

const postsController = {
  getOneArticle: async (req, res) => {
    try {
      const articleId = req.params.id;

      await base("article").find(articleId, (err, result) => {
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
      console.log(response);
      return res.status(200).json(response).end();
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = postsController;
