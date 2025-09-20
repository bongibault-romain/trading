"use client";

import Button from "@/components/Button";
import Chat from "@/components/Chat";
import Inventory from "@/components/Inventory";
import { OfferModal } from "@/components/OfferModal";
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

  return (<>
    <main className="w-full h-screen md:max-w-7xl p-4 mx-auto">
      <h1 className="text-4xl font-bold text-white py-8">
        Welcome {me?.nickname}.{" "}
        <small className="text-gray-300">You are trading with {other?.nickname}.</small>
      </h1>

      <div className="grid grid-cols-12 gap-x-0 gap-y-8 lg:gap-8 w-full">
        <div className="col-span-12 lg:col-span-4">
          <Chat
            title={"Live Chat with " + (other?.nickname || "Other Player")}
          />
        </div>
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <div className="bg-gray-700 px-4 py-2 text-white">
            <p className="text-justify">
              <strong>Tips: </strong> Select the items you want to give to{" "}
              {other?.nickname} from your inventory and select the items you
              want to receive from {other?.nickname}'s inventory. Then click
              "Make an Offer" to propose the trade.
            </p>
          </div>

          <Inventory
            title={"Your Inventory"}
            selectedItemIds={selectedItemIds}
            disabled={selectedOtherItemIds.length > 0}
            items={me?.inventory}
            onToggleItem={handleToggleItem}
          />
          <Inventory
            title={"Inventory of " + (other?.nickname || "Other Player")}
            selectedItemIds={selectedOtherItemIds}
            items={other?.inventory}
            onToggleItem={handleToggleOtherItem}
          />

          <div className="flex justify-end">
            <Button variant="danger">Cancel Offer</Button>
            <Button variant="primary">Make an Offer</Button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <Inventory title={"Inventory of Anna"} />
        </div>
      </div>
    </main>

    {/* <OfferModal givenItems={me?.inventory} receivedItems={other?.inventory} /> */}
  </>);
}
