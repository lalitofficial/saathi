import React from "react";

const headlineMetrics = [
  {
    title: "Character Count",
    value: 43,
    dasharray: "66,100",
    status: "Good",
    statusColor: "green",
    description:
      "Headlines that are about 55 characters long will display fully in search results and tend to get more clicks.",
    showSvg: true,
  },
  {
    title: "Word Count",
    value: 8,
    dasharray: "89,100",
    status: "Good",
    statusColor: "green",
    description:
      "Your headline has the right amount of words. Headlines are more likely to be clicked on in search results if they have about 6 words.",
    showSvg: true,
  },
  {
    title: "Sentiment",
    value: "😊",
    status: "Positive",
    statusColor: "green",
    description:
      "Positive headlines tend to get better engagement than neutral or negative ones.",
    showSvg: false,
  },
  {
    title: "Headline Type",
    value: "📋",
    status: "General",
    statusColor: "blue",
    description:
      "Headlines that are lists and how-to get more engagement on average than other types of headlines.",
    showSvg: false,
  },
];

const HeadlineStatsGrid = () => {
  return (
    <section className="flex py-8 max-w-5xl mx-auto flex-wrap justify-between gap-6">
      {headlineMetrics.map((metric, index) => (
        <div
          key={index}
          className={`flex flex-wrap bg-white rounded-lg shadow p-4 w-full md:w-[48%] border border-${metric.statusColor}-200`}
        >
          <div className="flex items-center justify-center w-[92px] h-[92px] relative mr-6">
            {metric.showSvg ? (
              <>
                <svg
                  viewBox="0 0 33.831 33.831"
                  className="w-full h-full -rotate-90"
                >
                  <circle
                    fill="none"
                    stroke="#cbeae1"
                    strokeWidth="2"
                    cx="16.915"
                    cy="16.915"
                    r="15.915"
                  />
                  <circle
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray={metric.dasharray}
                    strokeLinecap="round"
                    cx="16.915"
                    cy="16.915"
                    r="15.915"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {metric.value}
                  </div>
                </div>
              </>
            ) : (
              <div
                className={`w-[70px] h-[70px] rounded-full flex items-center justify-center text-3xl bg-${metric.statusColor}-100 text-${metric.statusColor}-600`}
              >
                {metric.value}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {metric.title}
            </h3>
            <div
              className={`text-${metric.statusColor}-600 font-semibold text-sm mb-2 flex items-center gap-2`}
            >
              <span
                className={`inline-block w-4 h-4 bg-${metric.statusColor}-500 rounded-full`}
              ></span>
              {metric.status}
            </div>
            <p className="text-gray-600 text-sm">{metric.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeadlineStatsGrid;
