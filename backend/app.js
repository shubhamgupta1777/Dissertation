require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://" +
  process.env.MONGO_USER +
  ":" +
  process.env.MONGO_PASSWORD +
  "@" +
  process.env.MONGO_CLUSTER;
const database = process.env.MONGO_DATABASE;

mongoose.connect(uri, {
  dbName: database,
});
const db = mongoose.connection;

db.on("error", (error) => {
  console.error(error);
});

db.once("open", () => {
  console.log("Connected to Database");
});

app.use(express.json());

const userRouter = require("./routes/user");
const projectRouter = require("./routes/project");
const objectiveRouter = require('./routes/objective');
const deliverableRouter = require('./routes/deliverable');
const taskRouter = require('./routes/task');



app.use("/api", userRouter, projectRouter, objectiveRouter, deliverableRouter, taskRouter);

app.listen(3000, () => {
  console.log("Server Started");
});
