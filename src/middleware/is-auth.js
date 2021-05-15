const { jwt } = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authrization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let decodedtoken;
  try {
    decodedtoken = jwt.verify(token, process.env.JWT_WEB_TOKEN_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedtoken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedtoken.userId;
  next();
};
