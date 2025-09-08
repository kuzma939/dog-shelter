// components/MatchBadge.jsx
export default function MatchBadge({ percent, reasons=[] }) {
  if (percent == null) return null;
  const title = `Чому:\n- ${reasons.slice(0,3).join('\n- ')}`;
  return (
    <div className="match-badge" title={title}>
      Match {percent}%
    </div>
  );
}
