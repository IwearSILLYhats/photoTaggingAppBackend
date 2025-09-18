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
    console.log(error);
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
        id: parseInt(req.params.stageid),
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
    console.log(error);
    response = error;
  } finally {
    return res.json(response);
  }
});
index.post("/guess", async (req, res) => {
  console.log("Guess received", req.body);
  let response;
  const tolerance = 1;
  try {
    const guess = await prisma.character.findUnique({
      select: {
        id: true,
        name: true,
        x_coordinate: true,
        y_coordinate: true,
      },
      where: {
        id: parseInt(req.body.id),
      },
    });
    if (!guess) throw new Error("Character not found");
    if (
      Math.abs(guess.x_coordinate - req.body.coordinates.x) > tolerance ||
      Math.abs(guess.y_coordinate - req.body.coordinates.y) > tolerance
    )
      return res.json({
        success: "Selected character not at those coordinates",
      });
    response = {
      success: {
        message: `${guess.name} located!`,
        character: {
          id: guess.id,
          name: guess.name,
          coordinates: {
            x: guess.x_coordinate,
            y: guess.y_coordinate,
          },
          found: true,
        },
      },
      error: null,
    };
  } catch (error) {
    console.log(error);
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
