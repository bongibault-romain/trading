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
  me: {
    id: string;
    nickname: string;
    inventory: { id: string; name: string }[];
  } | null;
  other: {
    id: string;
    nickname: string;
    inventory: { id: string; name: string }[];
  } | null;
  messages: { content: string; isSent: boolean; timeStamp: number }[];
  sendMessage: (message: string) => Promise<void>;
  offer: {
    playerId: string;
    offeredItemIds: string[];
    receivedItemIds: string[];
  } | null;
  submitOffer: (
    offeredItemIds: string[],
    receivedItemIds: string[]
  ) => Promise<void>;
  cancelOffer: () => Promise<void>;
  answerOffer: (accept: boolean) => Promise<void>;
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
  const [messages, setMessages] = React.useState<
    { content: string; isSent: boolean; timeStamp: number }[]
  >([]);
  const [offer, setOffer] = React.useState<{
    playerId: string;
    offeredItemIds: string[];
    receivedItemIds: string[];
  } | null>(null);

  function sendMessage(message: string) {
    return new Promise<void>((resolve, reject) => {
      if (!socket) return reject("No socket connection available.");

      socket.emit(
        "chatMessage",
        { message },
        (accepted: boolean, error: string | undefined) => {
          if (error) return reject(error);
          if (!accepted) return reject("Message not accepted by server.");
          resolve();
        }
      );
    });
  }

  function submitOffer(offeredItemIds: string[], receivedItemIds: string[]) {
    return new Promise<void>((resolve, reject) => {
      if (!socket) return reject("No socket connection available.");

      socket.emit(
        "submitOffer",
        { offeredItemIds, receivedItemIds },
        (accepted: boolean, error: string | undefined) => {
          if (error) return reject(error);
          if (!accepted) return reject("Offer not accepted by server.");

          setOffer({ playerId: me?.id || "", offeredItemIds, receivedItemIds });
          resolve();
        }
      );
    });
  }

  function cancelOffer() {
    return new Promise<void>((resolve, reject) => {
      if (!socket) return reject("No socket connection available.");

      socket.emit(
        "cancelOffer",
        (accepted: boolean, error: string | undefined) => {
          if (error) return reject(error);
          if (!accepted) return reject("Cancel offer not accepted by server.");

          setOffer(null);
          resolve();
        }
      );
    });
  }

  function answerOffer(accept: boolean) {
    return new Promise<void>((resolve, reject) => {
      if (!socket) return reject("No socket connection available.");
      if (!offer) return reject("No offer to answer.");

      socket.emit(
        "answerOffer",
        { accept },
        (accepted: boolean, error: string | undefined) => {
          if (error) return reject(error);
          if (!accepted) return reject("Answer offer not accepted by server.");

          resolve();
        }
      );
    });
  }

  useEffect(() => {
    if (socket && socket.connected) return;
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return;
    }

    setSocket(io(process.env.NEXT_PUBLIC_API_URL, {
      tryAllTransports: false,
      transports: ['websocket'],
    }));

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
      setOffer(null);
      setMessages([]);
    }

    function handleJoinedRoom(
      {
        player,
      }: {
        player: {
          id: string;
          nickname: string;
          inventory: { id: string; name: string }[];
        };
      },
      callback: () => void
    ) {
      setIsConnected(true);
      setIsStarted(false);
      setMessages([]);
      setOffer(null);
      setMe(player);

      callback();
    }

    function handleGameStarting({
      players,
    }: {
      players: {
        id: string;
        nickname: string;
        inventory: { id: string; name: string }[];
      }[];
    }) {
      setIsStarted(true);
      setOther(players.find((p) => p.id !== me?.id) || null);
    }

    function handleChatMessage({
      playerId,
      content,
      timestamp,
    }: {
      playerId: string;
      content: string;
      timestamp: number;
    }) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content, isSent: playerId === me?.id, timeStamp: timestamp },
      ]);
    }

    function handleNewOffer({
      offer,
    }: {
      offer: {
        playerId: string;
        offeredItemIds: string[];
        receivedItemIds: string[];
      };
    }) {
      setOffer(offer);
    }

    function handleOfferCancelled() {
      if (offer?.playerId === me?.id) {
        alert("Your offer has been cancelled.");
      }

      setOffer(null);
    }

    function handleOfferAccepted({
      offeringPlayerId,
      receivingPlayerId,
      offeredInventory,
      receivedInventory,
    }: {
      offeringPlayerId: string;
      receivingPlayerId: string;
      offeredInventory: { id: string; name: string }[];
      receivedInventory: { id: string; name: string }[];
    }) {
      setOffer(null);
      setMe((prevMe) => {
        if (!prevMe) return prevMe;
        
        return {
          ...prevMe,
          inventory: prevMe.id === offeringPlayerId ? offeredInventory : receivedInventory,
        };
      });

      setOther((prevOther) => {
        if (!prevOther) return prevOther;

        return {
          ...prevOther,
          inventory: prevOther.id === receivingPlayerId ? receivedInventory : offeredInventory,
        };
      });
    }

    socket.on("offerAccepted", handleOfferAccepted);
    socket.on("offerCancelled", handleOfferCancelled);
    socket.on("newOffer", handleNewOffer);
    socket.on("joinedRoom", handleJoinedRoom);
    socket.on("gameStarting", handleGameStarting);
    socket.on("disconnect", handleDisconnect);
    socket.on("chatMessage", handleChatMessage);

    return () => {
      socket.off("offerAccepted", handleOfferAccepted);
      socket.off("offerCancelled", handleOfferCancelled);
      socket.off("newOffer", handleNewOffer);
      socket.off("joinedRoom", handleJoinedRoom);
      socket.off("gameStarting", handleGameStarting);
      socket.off("disconnect", handleDisconnect);
      socket.off("chatMessage", handleChatMessage);
    };
  }, [socket, me, other, offer]);

  const connect = (nickname: string) => {
    if (!socket) return;

    socket.emit("joinGame", { nickname });
  };

  return (
    <SocketContext.Provider
      value={{
        connect,
        isConnected,
        isStarted,
        me,
        other,
        sendMessage,
        messages,
        offer,
        submitOffer,
        cancelOffer,
        answerOffer,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
