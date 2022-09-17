require("express-async-errors");
require("dotenv/config");

const express = require("express");

const { routes } = require("./routes");
const AppError = require("./errors/AppError");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(routes);

app.use((err, request, response, _) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: "error", message: err.message });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
