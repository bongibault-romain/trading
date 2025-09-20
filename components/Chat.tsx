"use client";

import React, { useEffect, useRef } from "react";
import Button from "./Button";
import MdiChevronRight from "./icons/MdiChevronRight";
import { useSocket } from "@/hooks/useSocket";

interface ChatProps {
  title: React.ReactNode;
}

export function Chat({ title }: ChatProps) {
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const { messages, sendMessage } = useSocket();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    if (message) {
      sendMessage(message)
        .then(() => {
          setMessage("");
        })
        .catch((err) => {
          alert(err);
        }).finally(() => {
          setSending(false);
        });
    }

    setSending(false);
  };

  return (
    <div>
      <div className="bg-gray-700 px-4 py-2 text-white">{title}</div>
      <div className="bg-gray-800 h-[450px] p-4 overflow-y-auto chat-scrollbar" ref={containerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 flex break-words ${
              message.isSent ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-2 rounded ${
                message.isSent
                  ? "bg-gray-400 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {message.content}
              <div className="text-xs text-gray-300 mt-1 text-right">
                {new Date(message.timeStamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="flex" onSubmit={handleSubmit}>
        <input
          className="bg-gray-700 w-full outline-0 text-white px-4 py-2"
          type="text"
          name="message"
          placeholder="Enter a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button className="flex items-center justify-center" type="submit" disabled={sending || !message.trim()}>
            {sending ? (
              <span className="loader" style={{ height: "24px", width: "24px", borderWidth: '2px' }}></span>
            ) : (
              <MdiChevronRight width={24} height={24} />
            )}
          
        </Button>
      </form>
    </div>
  );
}
export default Chat;
