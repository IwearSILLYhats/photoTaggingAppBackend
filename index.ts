const express = require("express");
const path = require("node:path");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.get("/stageselect", (req, res) => {
  return res.json({
    message: "Requesting list of stages and high scores for each.",
  });
});
app.get("/stage/:stageid", (req, res) => {
  return res.json({
    message: `Requesting stageid ${req.params.stageid}`,
  });
});
app.get("/guess", (req, res) => {
  return res.json({
    message: "Making a guess",
  });
});
app.post("/score", (req, res) => {
  return res.json({
    message: "Posting your high score!",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
});
