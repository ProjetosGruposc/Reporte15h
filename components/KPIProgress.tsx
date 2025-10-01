interface Props {
 title: string;
 value: string | number;
 sub?: string;
 meta?: number; // meta configurável (default 82)
}
export function KPIProgress({ title, value, sub, meta = 82 }: Props) {
 const pct = Math.max(0, Math.min(100, Number(value)));
 const falta = 100 - pct;
 return (
<div className="bg-white/5 rounded-xl p-4 shadow text-center">
<p className="text-xs uppercase text-gray-400">{title}</p>
     {/* Valor principal */}
<p className="text-3xl font-bold text-white mt-2">
       {pct.toFixed(1)}%
</p>
     {/* Barra dupla */}
<div className="relative w-full bg-gray-700 rounded-full h-4 mt-4">
       {/* Entregue */}
<div
         className="absolute top-0 left-0 h-4 rounded-l-full bg-green-500"
         style={{ width: `${pct}%` }}
       />
       {/* Falta */}
<div
         className="absolute top-0 left-[${pct}%] h-4 rounded-r-full bg-red-500"
         style={{ width: `${falta}%`, left: `${pct}%` }}
       />
       {/* Linha da meta */}
<div
         className="absolute top-0 h-4 w-0.5 bg-blue-400"
         style={{ left: `${meta}%` }}
       />
</div>
     {/* Texto auxiliar */}
<div className="flex justify-between text-xs mt-2 text-gray-300">
<span className="text-green-400">Entregue {pct.toFixed(1)}%</span>
<span className="text-red-400">Falta {falta.toFixed(1)}%</span>
<span className="text-blue-400">Meta {meta}%</span>
</div>
     {sub && (
<p className="text-xs text-gray-400 mt-1">{sub}</p>
     )}
</div>
 );
}