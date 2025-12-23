"use client";

import { VENDING_MACHINE_LOCATIONS } from "@/constants/location-data";
import { VendingMachineItem } from "./VendingMachineItem";

export const VendingMachineList = () => {
  return (
    <ol className="w-full flex flex-col gap-2 overflow-y-auto max-h-screen p-2">
      {VENDING_MACHINE_LOCATIONS.length === 0 ? (
        <a className="px-6 py-4 text-sm text-foreground">
          No vending machines found.
        </a>
      ) : (
        VENDING_MACHINE_LOCATIONS.map((user) => (
          <VendingMachineItem key={user.id} {...user} />
        ))
      )}
    </ol>
  );
};
