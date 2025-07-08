import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

export default function useViewedListingsSocket(sellerId) {
  const socket = useSocket();
  const [viewedCount, setViewedCount] = useState(0);

  useEffect(() => {
    if (!socket || !sellerId) return;

    const handler = () => setViewedCount((prev) => prev + 1);
    socket.on("listing_viewed", handler);

    return () => {
      socket.off("listing_viewed", handler);
    };
  }, [socket, sellerId]);

  return [viewedCount, setViewedCount];
}
