const { verify } = require("jsonwebtoken");

const AppError = require("../errors/AppError");
const authConfig = require("../config/auth");

const EnsureIsAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError("JWT token is missing", 401);
  }
};

module.exports = EnsureIsAuthenticated;
