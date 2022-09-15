const express = require('express');

const { routes } = require('./routes');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
