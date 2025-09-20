"use client";

import Button from "@/components/Button";
import Chat from "@/components/Chat";
import Inventory from "@/components/Inventory";
import { OfferModal } from "@/components/OfferModal";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    isConnected,
    isStarted,
    me,
    other,
    offer,
    submitOffer,
    cancelOffer,
    answerOffer,
  } = useSocket();
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isStarted && isConnected) return;

    router.push("/");
  }, [isStarted, isConnected, router]);

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
  };

  const handleCancelOffer = () => {
    if (!offer) return;

    setSubmittingOffer(true);

    cancelOffer()
      .catch(alert)
      .finally(() => {
        setSubmittingOffer(false);
      });
  };

  const handleAnswerOffer = (accept: boolean) => {
    return () => {
      answerOffer(accept).catch(alert);
    };
  };

  useEffect(() => {
    if (!offer) {
      setSelectedItemIds([]);
      setSelectedOtherItemIds([]);
    }
  }, [offer]);

  return (
    <>
      <main className="w-full h-screen md:max-w-5xl p-4 mx-auto">
        <h1 className="text-4xl font-bold text-white py-8">
          Welcome {me?.nickname}.{" "}
          <small className="text-gray-300">
            You are trading with {other?.nickname}.
          </small>
        </h1>

        <div className="grid grid-cols-10 gap-x-0 gap-y-8 lg:gap-8 w-full">
          <div className="col-span-12 lg:col-span-4">
            <Chat
              title={"Live Chat with " + (other?.nickname || "Other Player")}
            />
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            <div className="bg-gray-700 px-4 py-2 text-white">
              <p className="text-justify">
                <strong>Tips: </strong> Select the items you want to give to{" "}
                {other?.nickname} from your inventory and select the items you
                want to receive from {other?.nickname}&apos;s inventory. Then
                click &quot;Make an Offer&quot; to propose the trade.
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
                <div className="absolute inset-0 bg-black/70 pointer-events-none flex items-center justify-center">
                  <p className="text-white text-center">
                    Waiting for {other?.nickname} to respond...
                  </p>
                </div>
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
                <div className="absolute inset-0 bg-black/70 pointer-events-none flex items-center justify-center">
                  <p className="text-white text-center">
                    Waiting for {other?.nickname} to respond...
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              {offer && offer.playerId === me?.id ? (
                <Button
                  variant="danger"
                  onClick={handleCancelOffer}
                  disabled={submittingOffer}
                >
                  {submittingOffer ? "Cancelling..." : "Cancel Offer"}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmitOffer}
                  disabled={
                    submittingOffer ||
                    (selectedItemIds.length === 0 &&
                      selectedOtherItemIds.length === 0)
                  }
                >
                  {submittingOffer ? "Making Offer..." : "Make an Offer"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {offer && offer.playerId === other?.id && (
        <OfferModal
          onAccept={handleAnswerOffer(true)}
          onDecline={handleAnswerOffer(false)}
          givenItems={me?.inventory.filter((item) =>
            offer.receivedItemIds.includes(item.id)
          )}
          receivedItems={other?.inventory.filter((item) =>
            offer.offeredItemIds.includes(item.id)
          )}
        />
      )}
    </>
  );
}
