const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Connect to db
const sequelize = require("./config/db");
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((error) => {
    console.error("Error connecting to PostgreSQL:", error);
  });

// const { User, Project, Task, Dependency } = require("./models");
app.use("/user", require("./routes/userRoute"));
app.use("/project", require("./routes/projectRoute"));
app.use("/task", require("./routes/taskRoute"));
app.use("/dependency", require("./routes/dependencyRoute"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
