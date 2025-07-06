import express from "express";
import jwt from "jsonwebtoken";
import { JWT_TOKEN_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";

import { prismaClient} from "@repo/db/client"

const PORT = process.env.PORT || 3001;
const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Hello from the backend!",
  });
});

app.post("/signup", async (req, res) => {
  const parseData = CreateUserSchema.safeParse(req.body);

  if (!parseData.success) {
    res.json({
      message: "Invalid data",
    });
    return;
  }

  try{
    await prismaClient.user.create({
    data:{
      email: parseData.data.username,
      password: parseData.data.password,
      name: parseData.data.name,
    }
  })
  //db call
  res.json({
    userId: 123,
  });
  }catch(e){
    res.status(411).json({
      message: "User already exists wiht this username"
    })
  }
  
});

app.post("/signin", (req, res) => {
  const data = SigninSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Invalid data",
    });
    return;
  }
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_TOKEN_SECRET);

  res.json({
    token,
  });
});

app.post("/room", middleware, (req, res) => {
  //check the schema

  const data = CreateRoomSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Invalid data",
    });
    return;
  }

  res.json({
    roomId: 123,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
