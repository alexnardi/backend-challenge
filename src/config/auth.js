module.exports = {
  jwt: {
    secret: process.env.APP_SECRET,
    expiresIn: "5m", // 5 minutes
  },
};
