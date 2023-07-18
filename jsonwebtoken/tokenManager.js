const jwt = require("jsonwebtoken");

const TokenManager = {
  getTokens: (req) => {
    console.log(req);
  },
  createdToken: () => {
    return jwt.sign(
      {
        id,
        username,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 30,
      }
    );
  },

  tokenDecrypt: (token, secret) => {
    try {
      const decodedToken = jwt.verify(token, secret);
      return { err: err, token: decodedToken };
    } catch (err) {
      return { err: err, token: null };
    }
  },
  verifyToken: (token) => {},
};
module.exports = TokenManager;
