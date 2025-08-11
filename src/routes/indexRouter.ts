import express from "express";
const index = express.Router();
import { PrismaClient } from "../../prisma";
const prisma = new PrismaClient();

index.get("/stageselect", async (req, res) => {
  let response;
  try {
    const stages = await prisma.stage.findMany({
      include: {
        Score: true,
      },
    });
    if (!stages) {
      throw new Error("No stages found");
    }
    response = stages;
  } catch (error) {
    response = error;
  } finally {
    return res.json(response);
  }
});
index.get("/stage/:stageid", async (req, res) => {
  let response;
  try {
    const stageData = await prisma.stage.findUnique({
      where: {
        id: req.body.id,
      },
      include: {
        Character: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!stageData) {
      throw new Error(`Stage not found`);
    }

    response = stageData;
  } catch (error) {
    response = error;
  } finally {
    return res.json(response);
  }
});
index.get("/guess", async (req, res) => {
  let response;
  const tolerance = 1;
  try {
    const guess = await prisma.character.findUnique({
      where: {
        id: req.body.id,
      },
    });
    if (!guess) throw new Error("Character not found");
    if (
      Math.abs(guess.x_coordinate - req.body.x) > tolerance ||
      Math.abs(guess.y_coordinate - req.body.y) > tolerance
    )
      throw new Error("Selected character not at those coordinates");
    response = { success: "Correct guess!", error: null };
  } catch (error) {
    response = { error: error, success: null };
  } finally {
    return res.json(response);
  }
});
index.post("/score", (req, res) => {
  return res.json({
    message: "Posting your high score!",
  });
});

export default index;
