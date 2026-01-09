import React from "react";
import CircularScore from "./_components/CircularScore";
import WordBalanceCard from "./_components/WordBalanceCard";
import HeadlineStatsGrid from "./_components/HeadlineStatsGrid";
import SearchPreview from "./_components/SearchPreview";
function page() {
  return (
    <div className="m-4 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-slate-900 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-100">
      <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-8 text-center shadow-lg dark:border-slate-800/60 dark:bg-slate-950/70 dark:shadow-black/30">
        <h1 className="my-3 text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">
          Meta Title Analysis Tool
        </h1>
        <div className="my-5">
          <form className="mx-auto flex h-[4rem] w-full max-w-3xl items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-slate-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="block w-full rounded-lg border border-slate-300 bg-white px-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-sky-400 dark:focus:ring-sky-400"
                placeholder="Analyse Meta Title..."
                required=""
              />
            </div>
            <button
              type="submit"
              className="ms-2 rounded-lg border border-sky-600 bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-sky-500 hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-300/40 dark:border-sky-400 dark:bg-sky-400 dark:text-slate-900 dark:hover:border-sky-300 dark:hover:bg-sky-300"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                ></path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>
      </div>
      {/* bg-[#f5faff] */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-lg dark:border-slate-800/60 dark:bg-slate-950/70 dark:shadow-black/30">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-6 rounded-lg py-8 md:flex-row">
          {/* Left section: Analysis */}
          <div className="flex-1">
            <div className="flex flex-col">
              <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Headline Analysis for:
              </h2>
              <span className="pb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
                "Types Of Coffee Drinks Explained: A Beginner's Guide"
              </span>
            </div>
            <div className="flex flex-row">
              <div>
                <h3 className="mb-2 block text-lg font-semibold text-slate-700 dark:text-slate-200">
                  Overall Site Score
                </h3>
                <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
                  A very good score is between <strong>60 and 80</strong>. For
                  best results, you should strive for{" "}
                  <strong>70 and above</strong>.
                </p>
              </div>

              {/* Score Ring */}
              <div className="flex max-w-[200px] flex-col items-center justify-center text-center text-orange-500 dark:text-orange-400">
                <CircularScore score={54} />
              </div>
            </div>
          </div>

          {/* Right section: History */}
          <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-black/20 md:w-1/3">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Score History
            </h3>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-orange-500 px-3 py-1 text-lg font-bold text-white">
                54
              </div>
              <div>
                <p className="font-semibold leading-snug text-sky-600 dark:text-sky-300">
                  Types Of Coffee Drinks Explained: A Beginner's Guide
                </p>
              </div>
            </div>
            <button className="mt-4 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              Clear Score History
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-800/60 dark:bg-slate-950/70 dark:shadow-black/20">
        <WordBalanceCard />
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-800/60 dark:bg-slate-950/70 dark:shadow-black/20">
        <HeadlineStatsGrid />
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 pb-0 shadow-md dark:border-slate-800/60 dark:bg-slate-950/70 dark:shadow-black/20">
        <SearchPreview headline="Your Dynamic Headline Here" />
      </div>
    </div>
  );
}

export default page;
