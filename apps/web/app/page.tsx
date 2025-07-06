"use client"

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home(){
  const [roomId, setroomId] = useState("");
  const router = useRouter();

  return(
    <div style={{
      
    }}>
      <input value={roomId} onChange={(e)=>{
        setroomId(e.target.value);
      }} name="" id="" type="text" placeholder="Room ID" />

      <button onClick={()=>{
        router.push(`/room/${roomId}`)
      }}>Join Room</button>
    </div>
  )
}