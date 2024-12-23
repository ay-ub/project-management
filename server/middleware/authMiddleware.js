const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    return res
      .status(401)
      .json({ status: "fail", data: null, message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      status: "error",
      message: "Token is invalid or expired",
      data: null,
    });
  }
};

module.exports = protect;
