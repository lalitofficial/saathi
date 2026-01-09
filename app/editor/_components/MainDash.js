import React from "react";

function MainDash({ children }) {
  return (
    <main className="mx-4 my-6 mt-8 gap-2 rounded-2xl border border-slate-200 bg-white shadow-md md:flex md:items-start md:justify-between dark:border-slate-800 dark:bg-slate-950/70">
      {children}
    </main>
  );
}

export default MainDash;
