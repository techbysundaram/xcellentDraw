import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_TOKEN_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_TOKEN_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (e) {
    return null;
  }
  return null;
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  const decoded = jwt.verify(token, JWT_TOKEN_SECRET);

  if (!decoded || !(decoded as JwtPayload).userId) {
    ws.close();
    return;
  }

  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    const parseData = JSON.parse(data as unknown as string);

    if (parseData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parseData.roomId);
    }

    if (parseData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);

      if (!user) {
        return; // No matching user found for this websocket
      }

      // Remove the room from the user's rooms list
      user.rooms = user.rooms.filter((room) => room !== parseData.room);
    }

    if (parseData.type === "chat") {
      const roomId = parseData.roomId;
      const message = parseData.message;

      //inserting data into DB
      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });

  ws.send("something");
});
