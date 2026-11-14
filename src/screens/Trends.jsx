import { useState } from "react";
import MetricsCharts from "../components/TrendCharts";
import "../styles/trends.css";

const RANGES = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "30 days", value: 30 },
  { label: "All", value: undefined },
];

function Trends({ logs }) {
  const [rangeIndex, setRangeIndex] = useState(0);

  return (
    <div className="trends">
      <div className="trends__toolbar">
        <p className="trends__hint">
          <span className="trends__legend trends__legend--limit" aria-hidden="true" />
          Warning limit
          <span className="trends__legend trends__legend--dot" aria-hidden="true" />
          Day outside the limit
        </p>

        <div className="segmented" role="tablist" aria-label="Time range">
          {RANGES.map((range, index) => (
            <button
              key={range.label}
              type="button"
              role="tab"
              aria-selected={index === rangeIndex}
              className={`segmented__item${index === rangeIndex ? " is-active" : ""}`}
              onClick={() => setRangeIndex(index)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <MetricsCharts logs={logs} range={RANGES[rangeIndex].value} />
    </div>
  );
}

export default Trends;