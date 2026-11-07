/* Lightweight, dependency-free charts for case studies. Server components: pure SVG/CSS,
   zero client JS. Colors are the validated categorical order from the old site (colorblind-safe
   on the light surface); every chart has a legend and a "View as table" fallback. */

const PAL = ["#7466DB", "#D23C7E", "#D98A12", "#2E9E85"];
const NEUTRAL = "#B8B1CF";
type Datum = { label: string; value?: number; values?: number[] };

function fmt(v: number, unit = "") {
  return unit === "%" ? `${v}%` : `${v}${unit}`;
}

function Frame({ title, caption, children, table }: { title: string; caption?: string; children: React.ReactNode; table: React.ReactNode }) {
  return (
    <figure className="my-6 grid min-w-0 content-start gap-4 border-2 border-ink bg-surface p-5 shadow-[4px_4px_0_var(--color-lav)]">
      <figcaption>
        <b className="block text-[19px] leading-snug">{title}</b>
        {caption && <span className="text-[14.5px] text-muted">{caption}</span>}
      </figcaption>
      {children}
      <details className="text-[14.5px]">
        <summary className="cursor-pointer font-semibold text-pink">View as table</summary>
        <div className="mt-2 overflow-x-auto">{table}</div>
      </details>
    </figure>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>{head.map((h) => <th key={h} className="border-b border-line px-2 py-1 font-semibold text-muted">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j} className="border-b border-line px-2 py-1 tabular-nums">{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

/** <DonutChart title="…" center="48.7%" centerLabel="know it" data={[{label:"Know it", value:19}, …]} /> (max 4 slices) */
export function DonutChart({ title, caption, center, centerLabel, unit = "", data }: { title: string; caption?: string; center?: string; centerLabel?: string; unit?: string; data: Datum[] }) {
  const r = 52, C = 2 * Math.PI * r;
  const total = data.reduce((a, d) => a + (d.value ?? 0), 0) || 1;
  let acc = 0;
  return (
    <Frame title={title} caption={caption} table={<Table head={["Group", "Value"]} rows={data.map((d) => [d.label, fmt(d.value ?? 0, unit)])} />}>
      <div className="grid items-center gap-5 sm:grid-cols-[150px_minmax(0,1fr)]">
        <svg viewBox="0 0 140 140" className="mx-auto h-[150px] w-[150px]" role="img" aria-label={title}>
          <circle r={r} cx={70} cy={70} fill="none" stroke="#EEE9FC" strokeWidth={20} />
          <g transform="rotate(-90 70 70)">
            {data.slice(0, 4).map((d, i) => {
              const len = ((d.value ?? 0) / total) * C;
              const el = (
                <circle key={d.label} r={r} cx={70} cy={70} fill="none" stroke={PAL[i]} strokeWidth={20}
                  strokeDasharray={`${Math.max(len - 3, 0.1)} ${C}`} strokeDashoffset={-acc}>
                  <title>{`${d.label}: ${fmt(d.value ?? 0, unit)}`}</title>
                </circle>
              );
              acc += len;
              return el;
            })}
          </g>
          {center && <text x={70} y={68} textAnchor="middle" className="fill-ink text-[24px] font-extrabold">{center}</text>}
          {centerLabel && <text x={70} y={86} textAnchor="middle" className="fill-muted text-[10px]">{centerLabel}</text>}
        </svg>
        <ul className="grid gap-2 text-[15px]">
          {data.slice(0, 4).map((d, i) => (
            <li key={d.label} className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2">
              <i className="h-2.5 w-2.5 rounded-[3px]" style={{ background: PAL[i] }} />
              <span>{d.label}</span>
              <b className="tabular-nums">{fmt(d.value ?? 0, unit)}</b>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/** Horizontal bars. Single series: data={[{label, value}]}.
 *  Comparison: series={["Version A","Version B"]} data={[{label, values:[18,22]}]} (first series is neutral grey). */
export function BarChart({ title, caption, unit = "", max, highlight, series, data }: { title: string; caption?: string; unit?: string; max?: number; highlight?: number; series?: string[]; data: Datum[] }) {
  const all = data.flatMap((d) => d.values ?? [d.value ?? 0]);
  const top = max ?? Math.max(...all, 1);
  const colors = series ? [NEUTRAL, PAL[0], PAL[1], PAL[2]] : null;
  const table = series
    ? <Table head={["", ...series]} rows={data.map((d) => [d.label, ...(d.values ?? []).map((v) => fmt(v, unit))])} />
    : <Table head={["", "Value"]} rows={data.map((d) => [d.label, fmt(d.value ?? 0, unit)])} />;
  return (
    <Frame title={title} caption={caption} table={table}>
      {series && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
          {series.map((s, i) => (
            <span key={s} className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-[3px]" style={{ background: colors![i] }} />{s}</span>
          ))}
        </div>
      )}
      <div className="grid gap-3">
        {data.map((d, i) => {
          const vals = d.values ?? [d.value ?? 0];
          return (
            <div key={d.label} className={series ? "grid gap-1" : "grid grid-cols-[minmax(0,11em)_minmax(0,1fr)_3.4em] items-center gap-2.5 max-sm:grid-cols-[minmax(0,1fr)_3.4em]"}>
              <span className={`text-[15px] ${series ? "font-semibold" : "max-sm:col-span-2"}`}>{d.label}</span>
              {vals.map((v, k) => (
                <div key={k} className={series ? "grid grid-cols-[minmax(0,1fr)_3.4em] items-center gap-2" : "contents"}>
                  <span className="h-3.5 bg-lav-soft" title={`${d.label}${series ? `, ${series[k]}` : ""}: ${fmt(v, unit)}`}>
                    <span className="block h-full rounded-r-[4px]" style={{ width: `${(v / top) * 100}%`, background: colors ? colors[k] : i === highlight ? PAL[1] : PAL[0] }} />
                  </span>
                  <b className="text-right text-[15px] tabular-nums">{fmt(v, unit)}</b>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Frame>
  );
}
