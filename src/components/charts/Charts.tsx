// Lightweight, dependency-free, theme-aware charts. Every value is directly
// labeled (no data hidden behind hover, no color-only encoding), so the marks
// stay accessible in light/dark and under color-vision deficiency.

type Bar = { label: string; value: number; display: string };

// Champagne sequential ramp (dark→light) — used for magnitude, ordered.
const RAMP = ['#A8884B', '#B99A5C', '#C9A86A', '#D6BB84', '#E2CE9F'];

export function HorizontalBars({
  items,
  hue = '#C9A86A'
}: {
  items: Bar[];
  hue?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1.5 flex items-baseline justify-between text-sm">
            <span className="font-medium text-navy dark:text-ivory">{item.label}</span>
            <span className="font-semibold text-navy/80 dark:text-ivory/80">{item.display}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-navy/5 dark:bg-white/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: hue }}
              role="img"
              aria-label={`${item.label}: ${item.display}`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ShareBar({ segments }: { segments: { label: string; pct: number }[] }) {
  return (
    <div>
      <div className="flex h-6 w-full overflow-hidden rounded-full bg-navy/5" role="img" aria-label="Allocation of funds">
        {segments.map((s, i) => (
          <div
            key={s.label}
            className="h-full"
            style={{
              width: `${s.pct}%`,
              backgroundColor: RAMP[i % RAMP.length],
              marginLeft: i === 0 ? 0 : 2
            }}
            title={`${s.label}: ${s.pct}%`}
          />
        ))}
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3">
            <span
              className="h-3 w-3 flex-none rounded-sm"
              style={{ backgroundColor: RAMP[i % RAMP.length] }}
              aria-hidden="true"
            />
            <span className="text-sm text-navy">
              <span className="font-semibold">{s.pct}%</span> · {s.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Single-series area+line trend with a visible end value and baseline.
export function TrendArea({
  points,
  hue = '#C9A86A',
  caption
}: {
  points: { label: string; value: number }[];
  hue?: string;
  caption: string;
}) {
  const w = 320;
  const h = 120;
  const pad = 6;
  const max = Math.max(...points.map((p) => p.value), 1);
  const stepX = (w - pad * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (p.value / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1][0].toFixed(1)},${h - pad} L${coords[0][0].toFixed(1)},${h - pad} Z`;
  const last = points[points.length - 1];

  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={caption}>
        <defs>
          <linearGradient id={`g-${caption.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hue} stopOpacity="0.35" />
            <stop offset="100%" stopColor={hue} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#g-${caption.replace(/\s/g, '')})`} />
        <path d={line} fill="none" stroke={hue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 4 : 2.5} fill={hue} />
        ))}
      </svg>
      <figcaption className="mt-3 flex items-baseline justify-between">
        <span className="text-sm text-softgray">{caption}</span>
        <span className="font-serif text-2xl font-semibold text-navy">{last.value.toLocaleString()}</span>
      </figcaption>
      <div className="mt-1 flex justify-between text-[0.65rem] text-softgray">
        <span>{points[0].label}</span>
        <span>{last.label}</span>
      </div>
    </figure>
  );
}
