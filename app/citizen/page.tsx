"use client";

import { UserAccountManagementPanel } from "@/components/UserAccountManagement";

export default function Citizen() {
  return (
    <main className="w-full min-h-screen">
      <div className="flex flex-col items-left lg:items-center">
        <div className="flex flex-col w-full lg:max-w-5xl p-8">
          <h1 className="text-3xl font-bold mb-6">Citizen Dashboard</h1>
          <UserAccountManagementPanel />
        </div>
      </div>
    </main>
  );
}
