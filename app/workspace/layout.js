import React from "react";
import AppSideBar from "@/components/layout/AppSideBar";
import AppHeader from "@/components/layout/AppHeader";

function DashboardLayout({ children }) {
  return (
    <div>
      <div className="md:w-64 h-screen fixed">
        <AppSideBar />
      </div>
      <div className="md:ml-64">
        <AppHeader />
        <div>{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
