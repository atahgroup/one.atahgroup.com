"use client";

import { formatAddress, VendingMachine } from "@/constants/location-data";
import Image from "next/image";

const StatusBadge = (props: { status: string | undefined }) => {
  switch (props.status) {
    case "operational":
      return (
        <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
          ℹ️ Operational
        </span>
      );
    case "out_of_service":
      return (
        <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">
          ℹ️ Out of Service
        </span>
      );
    case "maintenance_required":
      return (
        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs">
          ℹ️ Maintenance Required
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs">
          ℹ️ Unknown
        </span>
      );
  }
};

const Model = (props: { model: string | undefined }) => {
  const model: string = props.model || "Unknown";

  return (
    <a className="text-black text-xs bg-cyan-100 dark:bg-cyan-100 px-2 py-1 rounded-full">
      ⚙️ {model}
    </a>
  );
};

const InstallationDate = (props: { date: Date | undefined }) => {
  const formattedDate =
    props.date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) || "Unknown";

  return (
    <a className="text-black text-xs bg-purple-100 px-2 py-1 rounded-full">
      🚀 {formattedDate}
    </a>
  );
};

const LastMaintenanceDate = (props: { date: Date | undefined }) => {
  const formattedDate =
    props.date?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }) || "Unknown";

  return (
    <a className="text-black text-xs bg-blue-100 px-2 py-1 rounded-full">
      👨🏻‍🔧 {formattedDate}
    </a>
  );
};

function handleClick(id: string) {
  // Implement the click handler logic here
  console.log("Vending machine ID:", id);
}

export const VendingMachineItem = (props: VendingMachine) => {
  return (
    <div className="flex flex-col rounded-xl p-2 border border-foreground/20">
      <div className="flex flex-col sm:flex-row rounded-xl gap-2">
        <div className="flex w-80">
          <Image
            alt="vending machine image"
            src={props.photo_url || ""}
            width={32}
            height={32}
            className="col-span-1 w-full max-w-32 max-h-32 rounded-xl"
          />

          <div className="ml-2 flex flex-col items-start gap-1">
            <Model model={props.model} />
            <InstallationDate date={props.installation_date} />
            <LastMaintenanceDate date={props.last_maintenance_date} />
            <StatusBadge status={props.status} />
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2 sm:items-end sm:justify-between">
          <a className="font-semibold text-md text-foreground break-all">
            {formatAddress(props.address)}
          </a>
          <a className="text-foreground text-sm">
            📍 {props.latitude}, {props.longitude}
          </a>
          <p className="text-foreground text-sm">📝 {props.spot_description}</p>
        </div>
        <button
          className="bg-blue-500 text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-100"
          onClick={() => handleClick(props.id)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
