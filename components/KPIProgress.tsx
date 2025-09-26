interface Props {

  title: string;

  value: number | string;

  sub?: string;

  color?: string; // ex: "text-green-400"

}

export function KPI({ title, value, sub, color }: Props) {

  return (
<div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
<p className="text-xs text-slate-400">{title}</p>
<p className={`text-2xl font-semibold ${color ?? ""}`}>{value}</p>

      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
</div>

  );

}
 
interface Props {

  title: string;

  value: number; // 0..100

  sub?: string;

}

export function KPIProgress({ title, value, sub }: Props) {

  const pct = Math.max(0, Math.min(100, value));

  const barColor =

    pct >= 82 ? "bg-green-500" : pct >= 70 ? "bg-yellow-500" : "bg-red-500";

  return (
<div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
<p className="text-xs text-slate-400">{title}</p>
<div className="flex items-baseline gap-2">
<p className="text-2xl font-semibold">{pct.toFixed(1)}%</p>

        {sub && <p className="text-xs text-slate-400">{sub}</p>}
</div>
<div className="h-2 w-full bg-slate-700 rounded mt-2">
<div className={`h-2 ${barColor} rounded`} style={{ width: `${pct}%` }} />
</div>
<p className="text-[10px] text-slate-400 mt-1">Meta: 82%</p>
</div>

  );

}
 