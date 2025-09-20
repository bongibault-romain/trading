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
  me: { id: string; nickname: string; inventory: { id: string; name: string }[] } | null;
  other: { id: string; nickname: string; inventory: { id: string; name: string }[] } | null;
  messages: { content: string; isSent: boolean; timeStamp: number }[];
  sendMessage: (message: string) => Promise<void>;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isStarted, setIsStarted] = React.useState(false);
  const [me, setMe] = React.useState<{
    id: string;
    nickname: string;
    inventory: { id: string; name: string }[];
  } | null>(null);
  const [other, setOther] = React.useState<{
    id: string;
    nickname: string;
    inventory: { id: string; name: string }[];
  } | null>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [messages, setMessages] = React.useState<{ content: string; isSent: boolean; timeStamp: number }[]>([]);

  function sendMessage(message: string) {    
    return new Promise<void>((resolve, reject) => {
      if (!socket) return reject("No socket connection available.");

      socket.emit("chatMessage", { message }, (accepted: boolean, error: string) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

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
    if (!socket) return;

    function handleDisconnect() {
      setIsConnected(false);
      setIsStarted(false);
      setMe(null);
      setOther(null);
      setMessages([]);
    }

    function handleJoinedRoom({
      player,
    }: {
      player: { id: string; nickname: string; inventory: { id: string; name: string }[] };
    }, callback: () => void) {
      setIsConnected(true);
      setIsStarted(false);
      setMessages([]);
      setMe(player);

      callback();
    }

    function handleGameStarting({
      players,
    }: {
      players: { id: string; nickname: string; inventory: { id: string; name: string }[] }[];
    }) {
      setIsStarted(true);
      setOther(players.find((p) => p.id !== me?.id) || null);
    }

    function handleChatMessage({ playerId, content, timestamp }: { playerId: string; content: string; timestamp: number }) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content, isSent: playerId === me?.id, timeStamp: timestamp },
      ]);
    }

    socket.on("joinedRoom", handleJoinedRoom);
    socket.on("gameStarting", handleGameStarting);
    socket.on("disconnect", handleDisconnect);
    socket.on("chatMessage", handleChatMessage);

    return () => {
      socket.off("joinedRoom", handleJoinedRoom);
      socket.off("gameStarting", handleGameStarting);
      socket.off("disconnect", handleDisconnect);
      socket.off("chatMessage", handleChatMessage);
    };
  }, [socket, me, other]);

  const connect = (nickname: string) => {
    if (!socket) return;

    socket.emit("joinGame", { nickname });
  };

  return (
    <SocketContext.Provider
      value={{ connect, isConnected, isStarted, me, other, sendMessage, messages }}
    >
      {children}
    </SocketContext.Provider>
  );
};
