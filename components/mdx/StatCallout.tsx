/** <StatCallout value="+42%" label="Key Metric" />
 *  Several in a row wrap into an even grid on their own (see the parent selector in globals.css). */
export function StatCallout({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-callout my-4 border-t-[3px] border-ink pt-3">
      <div className="font-display text-[40px] font-extrabold leading-none tracking-tight tabular-nums text-ink">{value}</div>
      <div className="mt-1.5 max-w-[24ch] text-[15px] leading-snug text-muted">{label}</div>
    </div>
  );
}
