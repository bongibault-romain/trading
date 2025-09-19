import Chat from "@/components/Chat";
import Inventory from "@/components/Inventory";

export default function Home() {
  return (
    <main className="w-screen h-screen grid grid-cols-12 gap-8 p-8 md:max-w-7xl mx-auto">
      <div className="col-span-4">
        <Chat />
      </div>
      <div className="col-span-5 flex flex-col gap-4">
          <Inventory title={"Your Inventory"} />
          <Inventory title={"Inventory of Elsa"} />
        
      </div>
    </main>
  );
}
