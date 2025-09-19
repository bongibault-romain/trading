import Image from "next/image";
import React from "react";

export function Inventory() {
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
    <div
      className="grid gap-2 w-full flex-wrap"
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
  );
}
export default Inventory;
