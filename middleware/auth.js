const jwt = require("jsonwebtoken");


const verify_token = (req, res, next) => {
  var token = req.headers['x-access-token'] || req.headers['authorization']
  if (!token) {
    return res.status(403).send("A token is required for authentication")
  }
  try {
    token = token.replace(/^Bearer\s+/, "")
    const decoded = jwt.verify(token,  process.env.TOKEN_KEY)
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token")
  }
  return next();
};

// export the function verify token
module.exports = verify_token;