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
  const statusStyles = {
    green: {
      card: "border-emerald-500/30 bg-emerald-500/5",
      ring: "text-emerald-500 dark:text-emerald-400",
      badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
      dot: "bg-emerald-400",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    blue: {
      card: "border-sky-500/30 bg-sky-500/5",
      ring: "text-sky-500 dark:text-sky-400",
      badge: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
      dot: "bg-sky-400",
      text: "text-sky-600 dark:text-sky-400",
    },
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-wrap justify-between gap-6 py-8">
      {headlineMetrics.map((metric, index) => {
        const styles = statusStyles[metric.statusColor];
        return (
          <div
            key={index}
            className={`flex w-full flex-wrap rounded-2xl border p-4 shadow-md shadow-slate-200/80 md:w-[48%] ${styles.card} dark:shadow-black/20`}
          >
            <div className="relative mr-6 flex h-[92px] w-[92px] items-center justify-center">
              {metric.showSvg ? (
                <>
                  <svg
                    viewBox="0 0 33.831 33.831"
                    className={`h-full w-full -rotate-90 ${styles.ring}`}
                  >
                    <circle
                      fill="none"
                      stroke="currentColor"
                      opacity="0.25"
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
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {metric.value}
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`flex h-[70px] w-[70px] items-center justify-center rounded-full text-3xl ${styles.badge}`}
                >
                  {metric.value}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                {metric.title}
              </h3>
              <div
                className={`mb-2 flex items-center gap-2 text-sm font-semibold ${styles.text}`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${styles.dot}`}
                ></span>
                {metric.status}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {metric.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default HeadlineStatsGrid;
