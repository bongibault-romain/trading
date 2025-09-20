import React, { createContext, PropsWithChildren, ReactNode } from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket: null }}></SocketContext.Provider>
  );
};
