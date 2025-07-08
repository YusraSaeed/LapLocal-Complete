// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppContext } from "./AppContext"; // Assuming it contains userData

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { userData, userRole } = useAppContext();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userData?._id || userRole !== "seller") return;

    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Socket connected:", socketRef.current.id);
      socketRef.current.emit("register", {
        userId: userData._id,
        role: userRole,
      });
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userData?._id, userRole]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
