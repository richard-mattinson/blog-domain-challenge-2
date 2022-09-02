// Require middleware
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
app.disable("x-powered-by");

// Add middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tell express to use your routers here
// const userRouter = require("./routers/user");
// const profileRouter = require("./routers/profile");
// const postRouter = require("./routers/post");
// app.use("/user", userRouter);
// app.use("/profile", profileRouter);
// app.use("/post", postRouter);

// Set the port
const port = 3000;

// Start API server
app.listen(port, () => {
  console.log(`\n Server is running on http://localhost:${port}\n`);
});
