"use client";

import Chat from "@/components/Chat";
import Inventory from "@/components/Inventory";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isConnected, isStarted, me, other } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (isStarted && isConnected) return;

    router.push("/");
  }, [isStarted]);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedOtherItemIds, setSelectedOtherItemIds] = useState<string[]>(
    []
  );

  const handleToggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleOtherItem = (id: string) => {
    setSelectedOtherItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <main className="w-screen h-screen grid grid-cols-12 gap-8 p-8 md:max-w-7xl mx-auto">
      <div className="col-span-12 lg:col-span-4">
        <Chat />
      </div>
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
        <Inventory
          title={"Your Inventory"}
          selectedItemIds={selectedItemIds}
          items={me?.inventory}
          onToggleItem={handleToggleItem}
        />
        <Inventory
          title={"Inventory of Elsa"}
          selectedItemIds={selectedOtherItemIds}
          items={other?.inventory}
          onToggleItem={handleToggleOtherItem}
        />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <Inventory title={"Inventory of Anna"} />
      </div>
    </main>
  );
}
