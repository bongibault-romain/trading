import React from "react";
import Button from "./Button";
import MdiChevronRight from "./icons/MdiChevronRight";

interface ChatProps {
    title: React.ReactNode;
}

export function Chat({ title }: ChatProps) {
    const messages = [
        { content: "Hello! How can I assist you today?", isSent: false, timeStamp: Date.now() },
        { content: "I have a question about my order.", isSent: true, timeStamp: Date.now() },
        { content: "Sure! Please provide your order number.", isSent: false, timeStamp: Date.now() },
        { content: "It's 12345.", isSent: true, timeStamp: Date.now() },
        { content: "Thank you! Let me check that for you.", isSent: false, timeStamp: Date.now() },
        { content: "I have a question about my order.", isSent: true, timeStamp: Date.now() },
        { content: "Sure! Please provide your order number.", isSent: false, timeStamp: Date.now() },
        { content: "It's 12345.", isSent: true, timeStamp: Date.now() },
        { content: "Thank you! Let me check that for you.", isSent: false, timeStamp: Date.now() },
    ]

  return (
    <div>
      <div className="bg-gray-700 px-4 py-2 text-white">{title}</div>
        <div className="bg-gray-800 h-[450px] p-4 overflow-y-auto chat-scrollbar">
            {messages.map((message, index) => (
                <div key={index} className={`mb-2 flex ${message.isSent ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-2 rounded ${message.isSent ? 'bg-gray-400 text-white' : 'bg-gray-600 text-white'}`}>
                        {message.content}
                        <div className="text-xs text-gray-300 mt-1 text-right">
                            {new Date(message.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <form className="flex">
            <input className="bg-gray-700 w-full outline-0 text-white px-4 py-2" type="text" name="message" placeholder="Enter a message" />
            
            <Button>
                <MdiChevronRight width={24} height={24} />
    
            </Button>
        </form>
    </div>
  );
}
export default Chat;
