const { Router } = require("express");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const AppError = require("../errors/AppError");
const Database = require("../database/config");
const authConfig = require("../config/auth");

const usersRoutes = Router();

usersRoutes.post("/signup", async (req, res) => {
  const db = await Database();

  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("You must give an email and a password.");
  }

  const findUser = await db.get(`SELECT * FROM users WHERE email = $email`, {
    $email: email,
  });

  if (findUser) {
    throw new AppError("User already exists.");
  }

  const twitch_id = Math.floor(Math.random() * 90000000) + 10000000;
  const hashedPassword = await hash(password, 8);

  await db.run(
    `INSERT INTO users(
    email,
    password,
    experience,
    points,
    twitch_id
  )VALUES(
    $email,
    $password,
    0,
    0,
    $twitch_id
  )`,
    {
      $email: email,
      $password: hashedPassword,
      $twitch_id: twitch_id,
    }
  );

  db.close();

  res.status(200).json({
    email,
    twitch_id,
  });
});

usersRoutes.post("/login", async (req, res) => {
  const db = await Database();
  const { email, password } = req.body;

  const findUser = await db.get(`SELECT * FROM users WHERE email = $email`, {
    $email: email,
  });

  if (!findUser) {
    throw new AppError("Incorrect email/password!", 401);
  }

  const passwordMatched = await compare(password, findUser.password);

  if (!passwordMatched) {
    throw new AppError("Incorrect email/password!", 401);
  }

  const { expiresIn, secret } = authConfig.jwt;

  const token = sign({}, secret, {
    subject: String(findUser.id),
    expiresIn,
  });

  delete findUser.password;

  db.close();

  res.status(200).json({
    user: findUser,
    token,
  });
});

module.exports = { usersRoutes };
