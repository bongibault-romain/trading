import Button from "./Button";
import LineMdArrowsHorizontal from "./icons/LineMdArrowsHorizontal";
import Inventory from "./Inventory";

interface OfferModalProps {
  givenItems?: { id: string; name: string }[];
  receivedItems?: { id: string; name: string }[];
  onAccept?: () => void;
  onDecline?: () => void;
}

export function OfferModal({
  givenItems,
  receivedItems,
  onAccept,
  onDecline,
}: OfferModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-10 p-4">
      <div className="flex flex-col items-center justify-center h-full gap-12 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row w-full items-center justify-around gap-12">
          <div className="w-full max-w-[530px]">
            <Inventory
              disabled
              title="You are giving"
              emptyMessage="Nothing"
              items={givenItems}
            />
          </div>

          <LineMdArrowsHorizontal
            className="text-white"
            height={128}
            width={128}
          />

          <div className="w-full max-w-[530px]">
            <Inventory
              disabled
              emptyMessage="Nothing"
              title="You are receiving"
              items={receivedItems}
            />
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end w-full gap-8">
          <Button
            variant="danger"
            className="w-full lg:w-auto"
            onClick={onDecline}
          >
            Decline
          </Button>
          <Button
            variant="primary"
            className="w-full lg:w-auto"
            onClick={onAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
