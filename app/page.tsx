'use client';

import { useSocket } from "@/hooks/useSocket";
import MdiChevronRight from "../components/icons/MdiChevronRight";
import Button from "@/components/Button";

export default function Home() {
  const { connect, isConnected, isStarted, me, other } = useSocket();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const nickname = formData.get("nickname") as string;

    connect(nickname);
  };

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        { !isConnected && (<div className="flex">
          <input className="bg-gray-700 outline-0 text-white px-4 py-2" type="text" name="nickname" placeholder="Enter your nickname" />
          
          <Button type="submit" disabled={isStarted}>
            <MdiChevronRight width={24} height={24} />
          </Button>
        </div>) }

        { isConnected && (<div className="flex items-center flex-col gap-8">
        <span className="loader"></span>
          <div className="text-white text-lg">Waiting for other players...</div>
        
        </div>
        )}
      </form>
    </main>
  );
}
