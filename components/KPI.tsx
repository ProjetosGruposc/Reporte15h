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