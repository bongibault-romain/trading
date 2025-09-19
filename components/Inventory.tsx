import Image from "next/image";
import React from "react";

interface InventoryProps {
  title: React.ReactNode;
}

export function Inventory({ title }: InventoryProps) {
  const items = [
    "12_bun_dish",
    "14_bacon_dish",
    "23_cheesecake_dish",
    "27_chocolate_dish",
    "29_cookies_dish",
    "12_bun_dish",
    "14_bacon_dish",
    "23_cheesecake_dish",
    "27_chocolate_dish",
    "29_cookies_dish",
    "12_bun_dish",
    "14_bacon_dish",
    "23_cheesecake_dish",
    "27_chocolate_dish",
    "29_cookies_dish",
    "12_bun_dish",
    "14_bacon_dish",
    "23_cheesecake_dish",
    "27_chocolate_dish",
    "29_cookies_dish",
  ];

  return (
    <div>
      <div className="bg-gray-700 px-4 py-2 text-white">{title}</div>
      <div
        className="grid gap-2 w-full flex-wrap p-2 bg-gray-600"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))" }}
      >
        {items.map((item, i) => (
          <div key={i} className="bg-gray-700 p-1 rounded-lg">
            <Image
              src={`/assets/images/Ghostpixxells_pixelfood/${item}.png`}
              alt={item}
              width={48}
              height={48}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default Inventory;
