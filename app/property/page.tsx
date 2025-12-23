import { VendingMachineList } from "@/components/VendingMachineList";
import React from "react";

export default function Property() {
  return (
    <main className="min-h-screen grid grid-cols-1 xl:grid-cols-3 grid-rows-2 xl:grid-rows-1">
      <div className="col-span-1 w-full">
        <h1 className="text-2xl font-bold mx-4 mt-3 mb-1">Vending Machines</h1>
        <VendingMachineList />
      </div>
      <div className="col-span-2 w-full flex bg-green-400">
        {/* TODO: interactive 3d world map */}
      </div>
    </main>
  );
}
