"use client";

import Button from "@/components/Button";
import Chat from "@/components/Chat";
import Inventory from "@/components/Inventory";
import { OfferModal } from "@/components/OfferModal";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isConnected, isStarted, me, other, offer, submitOffer, cancelOffer } = useSocket();
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isStarted && isConnected) return;

    router.push("/");
  }, [isStarted, isConnected]);

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

  const handleSubmitOffer = () => {
    if (offer) return;
    setSubmittingOffer(true);

    submitOffer(selectedItemIds, selectedOtherItemIds)
      .catch(alert)
      .finally(() => {
        setSubmittingOffer(false);
      });
  }

  const handleCancelOffer = () => {
    if (!offer) return;

    setSubmittingOffer(true);

    cancelOffer()
      .catch(alert)
      .finally(() => {
        setSubmittingOffer(false);
      });
  }

  return (
    <>
      <main className="w-full h-screen md:max-w-7xl p-4 mx-auto">
        <h1 className="text-4xl font-bold text-white py-8">
          Welcome {me?.nickname}.{" "}
          <small className="text-gray-300">
            You are trading with {other?.nickname}.
          </small>
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

            <div className="relative">
              <Inventory
                title={"Your Inventory"}
                selectedItemIds={selectedItemIds}
                items={me?.inventory}
                disabled={!!offer}
                onToggleItem={handleToggleItem}
              />

              {offer && (
                <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
              )}
            </div>

            <div className="relative">
              <Inventory
                title={"Inventory of " + (other?.nickname || "Other Player")}
                selectedItemIds={selectedOtherItemIds}
                items={other?.inventory}
                disabled={!!offer}
                onToggleItem={handleToggleOtherItem}
              />
              {offer && (
                <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
              )}
            </div>

            <div className="flex justify-end">
              {offer && offer.playerId === me?.id ? (
                <Button variant="danger" onClick={handleCancelOffer} disabled={submittingOffer}>
                  {submittingOffer ? "Cancelling..." : "Cancel Offer"}
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmitOffer} disabled={submittingOffer}>
                  {submittingOffer ? "Making Offer..." : "Make an Offer"}
                </Button>
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <Inventory title={"Inventory of Anna"} />
          </div>
        </div>
      </main>

      {offer && offer.playerId === other?.id && (
        <OfferModal
          givenItems={me?.inventory}
          receivedItems={other?.inventory}
        />
      )}
    </>
  );
}
