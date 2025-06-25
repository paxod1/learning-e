const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];  

    jwt.verify(token, process.env.seckey, (err, user) => {
      if (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json("Token is not valid");
      }
      req.user = user; // Attach user to request object
      console.log('athuntication sucess');
      
      next(); // Proceed to next middleware
    });
  } else {
    console.error("Authorization header is missing or incorrectly formatted");
    return res.status(401).json("Authorization header is missing or incorrect");
  }
};

module.exports = verifyToken;
