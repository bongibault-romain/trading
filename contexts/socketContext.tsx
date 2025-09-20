import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  connect: (nickname: string) => void;
  isConnected: boolean;
  isStarted: boolean;
  me: { id: string; nickname: string; inventory: string[] } | null;
  other: { id: string; nickname: string; inventory: string[] } | null;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isStarted, setIsStarted] = React.useState(false);
  const [me, setMe] = React.useState<{
    id: string;
    nickname: string;
    inventory: string[];
  } | null>(null);
  const [other, setOther] = React.useState<{
    id: string;
    nickname: string;
    inventory: string[];
  } | null>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    if (socket && socket.connected) return;
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return;
    }

    setSocket(io(process.env.NEXT_PUBLIC_API_URL));

    return () => {
      socket?.disconnect();
    };
  }, [isConnected]);

  useEffect(() => {
    console.log("Me changed:", me);
  }, [me])

  useEffect(() => {
    if (!socket) return;

    function handleDisconnect() {
      setIsConnected(false);
      setIsStarted(false);
      setMe(null);
      setOther(null);
    }

    function handleJoinedRoom({
      player,
    }: {
      player: { id: string; nickname: string; inventory: string[] };
    }, callback: () => void) {
      console.log("Joined room:", player);
      setIsConnected(true);
      setIsStarted(false);
      setMe(player);

      callback();
    }

    function handleGameStarting({
      players,
    }: {
      players: { id: string; nickname: string; inventory: string[] }[];
    }) {
      setIsStarted(true);
      setOther(players.find((p) => p.id !== me?.id) || null);
    }

    socket.on("joinedRoom", handleJoinedRoom);
    socket.on("gameStarting", handleGameStarting);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("joinedRoom", handleJoinedRoom);
      socket.off("gameStarting", handleGameStarting);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, me, other]);

  const connect = (nickname: string) => {
    if (!socket) return;

    socket.emit("joinGame", { nickname });
  };

  return (
    <SocketContext.Provider
      value={{ connect, isConnected, isStarted, me, other }}
    >
      {children}
    </SocketContext.Provider>
  );
};
