const jwt = require("jsonwebtoken");

// extraction du token
const extractBearer = (authorization) => {
  if (authorization === "Bearer null") return;

  if (typeof authorization !== "string") {
    return false;
  }
  // on isole le token
  const matches = authorization.match(/(bearer)\s+(\S+)/i);

  return matches && matches[2];
};

// vérification de la présence  du token

const checkTokenMiddleware = (req, res, next) => {
  console.log("checkTokenMiddleware");
  const token =
    req.headers.authorization && extractBearer(req.headers.authorization);
  console.log("typeof", typeof req.headers.authorization);
  console.log("HEADERS:", req.headers);
  console.log("TOKEN:", token);
  if (!token) {
    console.log("no token");
    return res.status(401).json({ message: "Pas de token trouvé" });
  }
  // vérifier la validité du token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    /* console.log("# ERR TOKEN:", err);
    console.log("# DECODED TOKEN:", decodedToken); */
    if (err) {
      console.log("bad token");
      return res.status(401).json({ message: "Bad token" });
    }

    next();
  });
};

module.exports = checkTokenMiddleware;
