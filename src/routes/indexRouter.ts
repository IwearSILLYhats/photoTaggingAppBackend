import express from "express";
const index = express.Router();
import { PrismaClient } from "../../prisma";
import { sign, verify } from "jsonwebtoken";
const prisma = new PrismaClient();

index.get("/stageselect", async (req, res) => {
  let response;
  try {
    const stages = await prisma.stage.findMany({
      include: {
        Score: {
          take: 5,
          orderBy: {
            time: "desc",
          },
          select: {
            username: true,
            time: true,
          },
        },
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
    const token = sign(
      {
        start: Date.now(),
        finished: 0,
        characters: stageData.Character,
      },
      process.env.SECRET as string
    );
    response = { ...stageData, token };
  } catch (error) {
    console.log(error);
    response = error;
  } finally {
    return res.json(response);
  }
});
index.post("/guess", async (req, res) => {
  let response;
  // tolerance is normalized percentage of target image height/width coordinates can be from DB coordinates for a correct guess
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
    if (!req.body.token) {
      throw new Error("No token, refresh to generate new token");
    }

    // confirm token is valid, then update list of found characters, then check if list is complete
    const secret = process.env.SECRET as string;
    const token = verify(req.body.token, secret) as Token;
    const newCharacterList = token.characters.map((character: any) => {
      if (character.id === guess.id) {
        return { ...character, found: true };
      }
      return character;
    });
    let newToken = {
      ...token,
      characters: newCharacterList,
      finished: 0,
    };
    if (newCharacterList.every((char) => char.found)) {
      newToken.finished = Date.now();
    }

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
        token: sign(newToken, secret),
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
index.post("/score", async (req, res) => {
  let response;
  try {
    const secret = process.env.SECRET as string;
    const token = verify(req.body.token, secret) as Token;
    console.log(token);
    if (!token) {
      throw new Error("Bad token, please refresh page");
    }
    if (token.finished < 1) {
      throw new Error("Time recording error, please refresh page");
    }
    const completionTime = token.finished - token.start;
    const postScore = await prisma.score.create({
      data: {
        username: req.body.username,
        time: completionTime,
        stage_id: parseInt(req.body.id),
      },
    });
    return res.json({
      message: `It took ${completionTime / 1000} seconds to find everyone!`,
    });
  } catch (error) {
    console.log(error);
    response = error;
  } finally {
    return res.json(response);
  }
});

interface Character {
  name: string;
  id: number;
  found?: boolean;
  coordinates?: coordinates;
}
interface Token {
  start: number;
  finished: number;
  characters: [Character];
}
interface coordinates {
  x: number;
  y: number;
}

export default index;
