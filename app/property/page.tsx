import { VendingMachineList } from "@/components/VendingMachineList";
import WorldPropertyMap from "@/components/WorldPropertyMap";

export default function Property() {
  return (
    <main className="grid grid-cols-1 xl:grid-cols-3 grid-rows-1">
      <div className="col-span-1 w-full pt-2 max-h-[calc(100vh-56px)] overflow-y-auto">
        <VendingMachineList />
      </div>
      <div className="col-span-2 w-full flex hidden xl:block bg-green-400">
        <WorldPropertyMap />
      </div>
    </main>
  );
}
