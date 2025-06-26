import React from "react";
import CircularScore from "./_components/CircularScore";
import WordBalanceCard from "./_components/WordBalanceCard";
import HeadlineStatsGrid from "./_components/HeadlineStatsGrid";
import SearchPreview from "./_components/SearchPreview";
function page() {
  return (
    <div className="rounded flex gap-2 flex-col m-2 text-black dark:bg-gray-800 p-2">
      <div className="shadow pb-8 mb-6 text-center rounded ">
        <h1 className="text-4xl pt-3 text-gray-800 my-3 font-bold">
          Meta Title Analysis Tool
        </h1>
        <div className="my-5">
          <form className="flex items-center w-[40vw] h-[4rem] mx-auto my-3">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Analyse Meta Title..."
                required=""
              />
            </div>
            <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
      <div className="shadow p-3 rounded  ">
        <div className="py-8  rounded-lg max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          {/* Left section: Analysis */}
          <div className="flex-1">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Headline Analysis for:
              </h2>
              <span className="text-2xl font-bold text-[#1b2a3d] pb-6">
                “Types Of Coffee Drinks Explained: A Beginner’s Guide”
              </span>
            </div>
            <div className="flex flex-row">
              <div>
                <h3 className="text-lg block font-semibold text-gray-700 mb-2">
                  Overall Site Score
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  A very good score is between <strong>60 and 80</strong>. For
                  best results, you should strive for{" "}
                  <strong>70 and above</strong>.
                </p>
              </div>

              {/* Score Ring */}
              <div className="flex flex-col items-center justify-center text-center text-orange-500 max-w-[200px]">
                <CircularScore score={54} />
              </div>
            </div>
          </div>

          {/* Right section: History */}
          <div className="bg-white rounded-lg p-6 shadow w-full md:w-1/3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Score History
            </h3>
            <div className="flex items-start gap-4">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-lg font-bold">
                54
              </div>
              <div>
                <p className="text-blue-600 font-semibold leading-snug">
                  Types Of Coffee Drinks Explained: A Beginner’s Guide
                </p>
              </div>
            </div>
            <button className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded">
              Clear Score History
            </button>
          </div>
        </div>
      </div>
      <div className="shadow bg-white p-6">
        <WordBalanceCard />
      </div>
      <div className="shadow bg-white p-6">
        <HeadlineStatsGrid />
      </div>
      <div className="shadow bg-white p-6 pb-0">
        <SearchPreview headline="Your Dynamic Headline Here" />
      </div>
    </div>
  );
}

export default page;
