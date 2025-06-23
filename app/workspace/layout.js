import React from "react";
import SideBar from "./_components/SideBar";
import Header from "./_components/Header";
import MainDash from "./_components/MainDash";

function DashboardLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SideBar />
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
        >
          <MainDash>{children}</MainDash>
          {/* <footer className="p-4 my-6 mx-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 xl:p-8 dark:bg-gray-800">
            FOOTER
          </footer> */}
          <p className="my-10 text-sm text-center text-gray-500">
            © 2019-2025
            <a
              href="https://flowbite.com/"
              className="hover:underline"
              target="_blank"
            >
              Flowbite.com
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
