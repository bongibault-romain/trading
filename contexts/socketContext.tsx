import React, { createContext, PropsWithChildren, ReactNode, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  connect: (nickname: string) => void;
  isConnected: boolean;
  isStarted: boolean; 
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isStarted, setIsStarted] = React.useState(false);
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return;
    }

    setSocket(io(process.env.NEXT_PUBLIC_API_URL))
  }, [])

  useEffect(() => {
    if (!socket) return;

    socket.on("joinedRoom", () => {
      setIsConnected(true);
      setIsStarted(false);
    })

  }, [socket])

  const connect = (nickname: string) => {
    if (!socket) return;

    socket.emit("joinGame", { nickname });
  }

  return (
    <SocketContext.Provider value={{ connect, isConnected, isStarted }}>
      {children}
    </SocketContext.Provider>
  );
};
