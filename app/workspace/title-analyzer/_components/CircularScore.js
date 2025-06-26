const CircularScore = ({ score = 54, total = 100 }) => {
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const dashOffset = circumference * (1 - score / total);

  return (
    <div className="relative w-[200px] h-[200px] flex items-center justify-center bg-[#f4f8fe] rounded-full">
      <svg height="200" width="200" className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          stroke="#cbeae1"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="100"
          cy="100"
        />
        {/* Progress Circle */}
        <circle
          stroke="#f07c00"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx="100"
          cy="100"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute text-center">
        <div className="text-[38px] font-bold text-orange-500 leading-none">
          {score}
          <span className="text-gray-500 text-xl font-medium"> / {total}</span>
        </div>
        <div className="text-orange-500 font-semibold text-xs mt-1">
          Needs Improvement!
        </div>
      </div>
    </div>
  );
};

export default CircularScore;
