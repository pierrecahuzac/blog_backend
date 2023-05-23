const jwt = require("jsonwebtoken");

// extraction du token
const extractBearer = (authorization) => {
  if (typeof authorization !== "string") {
    return false;
  }
  // on isole le token
  const matches = authorization.match(/(bearer)\s+(\S+)/i);

  return matches && matches[2];
};

// vérification de la présence  du token

const checkTokenMiddleware = (req, res, next) => {
  const token =
    req.headers.authorization && extractBearer(req.headers.authorization);
  console.log("typeof", typeof req.headers.authorization);
  console.log("HEADERS:", req.headers);
  console.log("TOKEN:", token);
  if (!token) {
    return res.status(401).json({ message: "Ho le petit malin" });
  }
  // vérifier la validité du token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    /* console.log("# ERR TOKEN:", err);
    console.log("# DECODED TOKEN:", decodedToken); */
    if (err) {
      return res.status(401).json({ message: "Bad token" });
    }

    next();
  });
};

module.exports = checkTokenMiddleware;
