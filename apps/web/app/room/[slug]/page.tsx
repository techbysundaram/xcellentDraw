import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";

async function getRoomId(slug: string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
    return response.data.room.id;
  } catch (error) {
    console.error("Error fetching room ID:", error);
    throw error;
  }
}

export default async function ChatRoom1({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  try {
    const roomId = await getRoomId(params.slug);
    return <ChatRoom id={roomId.toString()} />;
  } catch (error) {
    return <div>Failed to load chat room</div>;
  }
}