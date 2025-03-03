const { BAD_REQUEST } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  const authToken = req.cookies.authToken;
  if (!authToken) {
    return res.status(BAD_REQUEST).json({
      data: null,
      error: {
        errorcode: "DMS-VEO",
        message: "Authentication failed: No authToken  provided",
      },
    });
  }
  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        data: null,
        error: {
          errorcode: "DMS-VEO",
          message: "Authentication failed: authToken invalid",
        },
      });
    } else {
      req.user_id = decoded.user_id;
      req.req_id = decoded.req_id;
      req.role = decoded.role;
      next();
    }
  });
};

module.exports = auth;
