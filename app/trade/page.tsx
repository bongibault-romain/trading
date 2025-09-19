import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="w-screen h-screen grid grid-cols-12 gap-8 p-8 md:max-w-7xl mx-auto">
      <div className="col-span-4">
        <Chat />
      </div>
    </main>
  );
}
