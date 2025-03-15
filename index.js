import express from "express";
import "dotenv/config";
import { databaseInit } from "./database/connectPostgres.js";

const app = express();
const PORT = 8585;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/helloworld", (req, res) => {
  res.send("<h1>Hello admin!</h1>");
});

app.get("/helloworld-json", (req, res) => {
  res.json({ message: "Hello admin!" });
});

databaseInit();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
