import index from "../../src/routes/indexRouter";
import supertest from "supertest";
import express from "express";
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", index);

jest.mock("prisma");

test("index route works", (done) => {
  supertest(app)
    .get("/stageselect")
    .expect("Content-Type", /json/)
    .expect([{ name: "Gotham Knights" }, { name: "Tarantino" }])
    .expect(200, done);
});
