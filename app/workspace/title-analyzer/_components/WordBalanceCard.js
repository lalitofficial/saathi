import React from "react";

const WordBalanceCard = () => {
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
    <div className="bg-white rounded-xl py-8  max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Word Balance</h2>
        <span className="text-orange-500 font-semibold text-sm flex items-center gap-1">
          ⚠️ Needs improvement
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium text-gray-700 flex gap-1 items-center">
                {cat.label}
                <span className="text-gray-400 cursor-pointer">?</span>
              </div>
              <span
                className={`font-bold ${
                  cat.status === "success" ? "text-green-600" : "text-red-500"
                }`}
              >
                {cat.status === "success" ? "✓" : "✕"} {cat.percent}%
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-1">Goal: {cat.goal}</div>
            <div className="w-full h-2 rounded-full bg-gray-200 mb-2">
              <div
                className={`h-full rounded-full ${
                  cat.status === "success" ? "bg-green-500" : "bg-gray-300"
                }`}
                style={{ width: `${cat.percent}%` }}
              ></div>
            </div>
            {cat.words.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {cat.words.map((word, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded"
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
      <div className="mt-6 max-w-5xl flex items-center gap-4 pb-4 border-t pt-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-lg text-gray-700 mb-6">
            Take a look at the suggestions from the summary above and tweak your
            headline. Then test again by typing your new headline into the
            analyzer to see how your score improved!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(suggestions).map(([category, words]) => (
              <div
                key={category}
                className="bg-blue-50 rounded-lg p-4 shadow-sm border"
              >
                <h3 className="text-md font-bold text-gray-800 mb-4">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {words.map((word, index) => (
                    <li key={index} className="text-gray-800">
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
