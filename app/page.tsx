import MdiChevronRight from "../components/icons/MdiChevronRight";
import Button from "@/components/Button";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <form>
        <div className="flex">
          <input className="bg-gray-700 outline-0 text-white px-4 py-2" type="text" name="nickname" placeholder="Enter your nickname" />
          
          <Button>
            <MdiChevronRight width={24} height={24} />
          </Button>
        </div>
      </form>
    </main>
  );
}
