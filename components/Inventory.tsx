import Image from "next/image";
import React from "react";
import MdiCheck from "./icons/MdiCheck";

interface InventoryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  selected?: boolean;
}

function InventoryItem({ name, selected, ...props }: InventoryItemProps) {
  return (
    <div
      className="bg-gray-700 p-1 rounded-lg relative hover:scale-105 transition-transform duration-200 hover:bg-gray-800 cursor-pointer"
      {...props}
    >
      <Image
        src={`/assets/images/Ghostpixxells_pixelfood/${name}.png`}
        alt={name}
        width={48}
        height={48}
      />

      {selected && (
        <div className="absolute flex items-center justify-center text-white top-0 left-0 w-full h-full bg-black/50 rounded-lg pointer-events-none">
          <MdiCheck height={32} width={32} />
        </div>
      )}
    </div>
  );
}

export interface InventoryItem {
  id: string;
  name: string;
}

interface InventoryProps {
  title: React.ReactNode;
  items?: InventoryItem[];
  selectedItemIds?: string[];
  onToggleItem?: (id: string) => void;
}

export function Inventory({
  title,
  items,
  selectedItemIds,
  onToggleItem,
}: InventoryProps) {
  return (
    <div>
      <div className="bg-gray-700 px-4 py-2 text-white">{title}</div>
      <div
        className="grid gap-2 w-full flex-wrap p-2 bg-gray-600 select-none"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))" }}
      >
        {items?.map((item, i) => (
          <InventoryItem
            selected={selectedItemIds?.includes(item.id)}
            key={i}
            onClick={() => onToggleItem?.(item.id)}
            name={item.name}
          />
        ))}

        {items?.length === 0 && (
          <div className="text-white text-center py-8 col-span-full">
            Inventory is empty
          </div>
        )}
      </div>

    </div>
  );
}
export default Inventory;
