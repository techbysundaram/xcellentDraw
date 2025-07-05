import express from "express";
import jwt from "jsonwebtoken";
import { JWT_TOKEN_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";

const app = express();

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);

  if (!data.success) {
    res.json({
      message: "Invalid data",
    });
    return;
  }
  //db call
  res.json({
    userId: 123,
  });
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

app.listen(3000);
