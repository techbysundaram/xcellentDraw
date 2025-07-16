import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNDdmYmRjYy01NGM0LTQ4MTItOWQ0Yy03NWY5NTcyMzIxMjIiLCJpYXQiOjE3NTI2Nzc4ODB9.n5KBDPSxzFsOsIZfe1GJixitle_EqHJWBR2I8D150kM";
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };

    return () => {
      ws.close();
    };
  }, []);

  return { socket, loading };
}
