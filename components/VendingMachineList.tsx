"use client";

import { VENDING_MACHINE_LOCATIONS } from "@/constants/location-data";
import { VendingMachineItem } from "./VendingMachineItem";

export const VendingMachineList = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between px-3">
        <h1 className="text-2xl font-bold">Vending Machines</h1>
        <a>Count: {VENDING_MACHINE_LOCATIONS.length}</a>
      </div>

      <ol className="w-full flex flex-col gap-2 overflow-y-auto max-h-screen p-2">
        {VENDING_MACHINE_LOCATIONS.length === 0 ? (
          <a className="p-2 text-sm text-foreground">
            No vending machines found.
          </a>
        ) : (
          VENDING_MACHINE_LOCATIONS.map((user) => (
            <VendingMachineItem key={user.id} {...user} />
          ))
        )}
      </ol>
    </div>
  );
};
