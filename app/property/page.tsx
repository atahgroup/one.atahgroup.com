import { VendingMachineList } from "@/components/VendingMachineList";
import React from "react";

export default function Property() {
  return (
    <main className="min-h-screen flex flex-col xl:flex-row gap-2">
      <div className="w-full flex bg-background">
        <VendingMachineList />
      </div>
      <div className="w-full flex bg-green-400">
        {/* TODO: interactive 3d world map */}
      </div>
    </main>
  );
}
