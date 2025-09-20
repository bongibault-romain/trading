'use client';

import Chat from "@/components/Chat";
import Inventory from "@/components/Inventory";
import { useState } from "react";

export default function Home() {
  const items = [
    { id: "1", name: "06_apple_pie_dish" },
    { id: "2", name: "08_bread_dish" },
    { id: "3", name: "10_baguette_dish" },
    { id: "4", name: "12_bun_dish" },
    { id: "5", name: "14_bacon_dish" },
    { id: "6", name: "16_burger_dish" },
    { id: "7", name: "19_burrito_dish" },
    { id: "8", name: "21_bagel_dish" },
  ]
  const otherItems = [
    { id: "6", name: "16_burger_dish" },
    { id: "2", name: "08_bread_dish" },
    { id: "5", name: "14_bacon_dish" },
    { id: "1", name: "06_apple_pie_dish" },
    { id: "3", name: "10_baguette_dish" },
    { id: "8", name: "21_bagel_dish" },
    { id: "4", name: "12_bun_dish" },
    { id: "7", name: "19_burrito_dish" },
  ]

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedOtherItemIds, setSelectedOtherItemIds] = useState<string[]>([]);

  const handleToggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleOtherItem = (id: string) => {
    setSelectedOtherItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <main className="w-screen h-screen grid grid-cols-12 gap-8 p-8 md:max-w-7xl mx-auto">
      <div className="col-span-12 lg:col-span-4">
        <Chat />
      </div>
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
        <Inventory title={"Your Inventory"} selectedItemIds={selectedItemIds} items={items} onToggleItem={handleToggleItem} />
        <Inventory title={"Inventory of Elsa"} selectedItemIds={selectedOtherItemIds} items={otherItems} onToggleItem={handleToggleOtherItem} />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <Inventory title={"Inventory of Anna"} />
      </div>
    </main>
  );
}
