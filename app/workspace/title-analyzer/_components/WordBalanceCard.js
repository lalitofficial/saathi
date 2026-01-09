import React from "react";

const WordBalanceCard = () => {
  const statusStyles = {
    success: {
      text: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-400",
    },
    error: {
      text: "text-rose-600 dark:text-rose-400",
      bar: "bg-slate-300 dark:bg-slate-700",
    },
  };
  const categories = [
    {
      label: "Common Words",
      percent: 25,
      goal: "20–30%",
      status: "success",
      words: ["a", "of"],
    },
    {
      label: "Uncommon Words",
      percent: 0,
      goal: "10–20%",
      status: "error",
      words: [],
    },
    {
      label: "Emotional Words",
      percent: 0,
      goal: "10–15%",
      status: "error",
      words: [],
    },
    {
      label: "Power Words",
      percent: 0,
      goal: "at least one",
      status: "error",
      words: [],
    },
  ];
  const suggestions = {
    "Power Words": [
      "Great",
      "Free",
      "Focus",
      "Remarkable",
      "Confidential",
      "Sale",
      "Wanted",
      "Clearance",
    ],
    "Emotion Words": [
      "Foul",
      "Hope",
      "Killer",
      "Frantic",
      "Horrific",
      "Know It All",
      "Epic",
    ],
    "Uncommon Words": [
      "Actually",
      "Happened",
      "Need",
      "Thing",
      "Awesome",
      "Heart",
      "Never",
      "Think",
    ],
  };
  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white px-6 py-8 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/70">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Word Balance
        </h2>
        <span className="flex items-center gap-1 text-sm font-semibold text-orange-500 dark:text-orange-400">
          ⚠️ Needs improvement
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                {cat.label}
                <span className="cursor-pointer text-slate-400 dark:text-slate-500">
                  ?
                </span>
              </div>
              <span
                className={`font-bold ${statusStyles[cat.status].text}`}
              >
                {cat.status === "success" ? "✓" : "✕"} {cat.percent}%
              </span>
            </div>
            <div className="mb-1 text-xs text-slate-500 dark:text-slate-500">
              Goal: {cat.goal}
            </div>
            <div className="mb-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${statusStyles[cat.status].bar}`}
                style={{ width: `${cat.percent}%` }}
              ></div>
            </div>
            {cat.words.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {cat.words.map((word, i) => (
                  <span
                    key={i}
                    className="rounded bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Card */}
      <div className="mt-6 flex max-w-5xl items-center gap-4 border-t border-slate-200/80 pb-4 pt-6 dark:border-slate-800/60">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-lg text-slate-600 dark:text-slate-300">
            Take a look at the suggestions from the summary above and tweak your
            headline. Then test again by typing your new headline into the
            analyzer to see how your score improved!
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Object.entries(suggestions).map(([category, words]) => (
              <div
                key={category}
                className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60"
              >
                <h3 className="mb-4 text-md font-bold text-slate-800 dark:text-slate-100">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {words.map((word, index) => (
                    <li key={index} className="text-slate-700 dark:text-slate-200">
                      {word}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordBalanceCard;
