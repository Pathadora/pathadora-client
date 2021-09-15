const jwt = require('jsonwebtoken');
const config = require('../config/default.json');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log("token", token)
  // Check if token is present
  if (!token) {
    console.log("nulltoken")
    return res.status(401).json( { msg: 'Token is missing, access denied' });
  }
  // Verify token
  try {
    const decodedToken = jwt.verify(token, config.jwtToken);
    console.log("decoded", decodedToken)
    req.user = decodedToken.user;
    next();
  } catch(err) {
    console.log("invalid")
    res.status(401).json({ msg: 'Invalid token' });
  }
};
