const postsController = {
  getAllPosts: async (req, res) => {
    try {
      const articles = await fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Article`,
        {
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          },
        }
      );
      const response = await articles.json();
      console.log(response);
      console.log("ici");
      res.status(200).json(response).end();
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = postsController;
