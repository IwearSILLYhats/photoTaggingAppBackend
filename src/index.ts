import express from "express";
import path from "node:path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "../prisma";
const prisma = new PrismaClient();
import index from "./routes/indexRouter";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.use("/", index);

app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
});
