import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function AppHeader() {
  return (
    <div className="flex h-15 justify-end p-5 shadow-sm">
      <UserButton />
    </div>
  );
}
