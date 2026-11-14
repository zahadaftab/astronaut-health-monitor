import { METRIC_TAGS } from "../data/metricTags.js";

function HazardTag({ metric }) {
  const tag = METRIC_TAGS[metric];
  if (!tag) return null;

  return (
    <small style={{ color: "#66fcf1", fontWeight: "normal" }}>
      🛰️ {tag.text} ({tag.hazard})
    </small>
  );
}

export default HazardTag;
