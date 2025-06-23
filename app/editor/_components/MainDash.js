import React from "react";

function MainDash({ children }) {
  return (
    <main className="bg-gray-50 my-6 mx-4 gap-2 mt-8 rounded-lg shadow md:flex md:items-start md:justify-between dark:bg-gray-900">
      {children}
    </main>
  );
}

export default MainDash;
