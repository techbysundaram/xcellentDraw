import express from "express";
import jwt from "jsonwebtoken";
import { JWT_TOKEN_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";

import { prismaClient } from "@repo/db/client";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

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

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parseData.data.username,
        //hash the password before storing
        password: parseData.data.password,
        name: parseData.data.name,
      },
    });
    //db call
    res.json({
      message: `User created with user ID ${user?.id}`,
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists wiht this username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Invalid data",
    });
    return;
  }
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.json({
      message: "User not found",
    });
    return;
  }

  const token = jwt.sign({ userId: user?.id }, JWT_TOKEN_SECRET);

  res.json({
    token,
  });
});

app.post("/room", middleware, async (req, res) => {
  //check the schema

  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Invalid data",
    });
    return;
  }

  try {
    //@ts-ignore TODO: fix this
    const userId = req.userId;

    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "room already exist",
    });
  }
});

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
