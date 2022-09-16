const {Router} = require('express');
const Database = require('../database/config');

const usersRoutes = Router();

usersRoutes.get('/signup' , async (req, res) => {
  const db = await Database();
  
  const { email, password } = req.body;
  console.log("🚀 ~ file: users.js ~ line 10 ~ usersRoutes.get ~ email", email, password)

  if (!email || !password) {
    res.status(400).json({
      error: 'You must give an email and a password.'
    });
  }

  const twitch_id = Math.floor(Math.random() * 90000000) + 10000000;
  console.log("🚀 ~ file: users.js ~ line 19 ~ usersRoutes.get ~ 10000000", 10000000)

  const user = await db.run(`INSERT INTO users(
    email,
    password,
    experience,
    points,
    twitch_id
  )VALUES(
    "${email}",
    "${password}",
    0,
    0,
    "${twitch_id}"
  )`);
  console.log("🚀 ~ file: users.js ~ line 18 ~ usersRoutes.get ~ user", user);

  res.status(200).json(user);
});

usersRoutes.get('/login' , async (req, res) => {
  const db = await Database();

res.status(200).json(user);
});

module.exports = {usersRoutes};