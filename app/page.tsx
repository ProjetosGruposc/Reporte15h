"use client";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import Image from "next/image";
import FileUploader from "@/components/FileUploader";
import { KPI } from "@/components/KPI";
import { KPIProgress } from "@/components/KPIProgress";
import { DoughnutChart, BarChart } from "@/components/Charts";
import TransportadoraSelect, { Option } from "../components/TransportadiraSelect";
import { RawRow, ManifestoConsolidado } from "@/types/report";
import { consolidateByManifest } from "../utils/getuniqueMainfests";
import { normalize } from "@/utils/status";
import { color } from "chart.js/helpers";
const META = 82; // %
export default function Page() {
 const [rows, setRows] = useState<RawRow[]>([]);
 const [manifests, setManifests] = useState<ManifestoConsolidado[]>([]);
 const [filterTsps, setFilterTsps] = useState<string[]>([]);
 const [embarqueData, setEmbarqueData] = useState<string | null>(null);
 // ------- helpers para data "Embarcado" -------
 const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
 const excelSerialToDate = (n: number) => {
   // Excel base date: 1899-12-30 (considerando bug de 1900)
   const epoch = new Date(Date.UTC(1899, 11, 30));
   const ms = n * 24 * 60 * 60 * 1000;
   return new Date(epoch.getTime() + ms);
 };
 const parseMaybeDate = (v: unknown): Date | null => {
   if (!v && v !== 0) return null;
   if (v instanceof Date && !isNaN(v.getTime())) return v;
   if (typeof v === "number") {
     const d = excelSerialToDate(v);
     return isNaN(d.getTime()) ? null : d;
   }
   if (typeof v === "string") {
     const s = v.trim();
     // dd/mm/yyyy
     const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
     if (m) {
       const d = parseInt(m[1], 10);
       const mo = parseInt(m[2], 10) - 1;
       const y = parseInt(m[3].length === 2 ? "20" + m[3] : m[3], 10);
       const dt = new Date(y, mo, d);
       return isNaN(dt.getTime()) ? null : dt;
     }
     // ISO ou outros formatos que o Date() entenda
     const dt = new Date(s);
     return isNaN(dt.getTime()) ? null : dt;
   }
   return null;
 };
 const formatPtNoDe = (d: Date) => {
   const day = String(d.getDate()).padStart(2, "0");
   const month = d.toLocaleDateString("pt-BR", { month: "long" });
   const year = d.getFullYear();
   return `${day} ${cap(month) } ${year}`; // "25 Setembro 2025"
 };
 // --------------------------------------------
 function handleFile(file: File) {
   const reader = new FileReader();
   reader.onload = (e) => {
     const buf = e.target?.result;
     // cellDates: true ajuda quando a célula já é data
     const wb = XLSX.read(buf, { type: "array", cellDates: true });
     const ws = wb.Sheets[wb.SheetNames[0]];
     const raw = XLSX.utils.sheet_to_json<RawRow>(ws, { defval: "" });
     setRows(raw);
     // 1) Consolida por Manifesto
     const mf = consolidateByManifest(raw);
     setManifests(mf);
     // 2) Acha a coluna de "Embarcado" (qualquer variação que contenha "embarc")
     const keys = Object.keys(raw[0] ?? {});
     const embarcadoKey =
       keys.find((k) => k && k.toString().toLowerCase().includes("embarc")) ?? "Embarcado";
     // 3) Procura a primeira célula não vazia nessa coluna e tenta parsear como data
     let found: string | null = null;
     for (const r of raw) {
       const val = (r as Record<string, unknown>)[embarcadoKey];
       if (val !== "" && val != null) {
         const d = parseMaybeDate(val);
         if (d) {
           found = formatPtNoDe(d);
         } else {
           // se não for data, mostra cru
           found = String(val);
         }
         break;
       }
     }
     setEmbarqueData(found);
   };
   reader.readAsArrayBuffer(file);
 }
 // opções de transportadora
 const tspOptions: Option[] = useMemo(() => {
   const set = new Set<string>();
   manifests.forEach((m) => {
     if (m.transportadora) set.add(m.transportadora);
   });
   return Array.from(set)
     .sort()
     .map((t) => ({ value: t, label: t.toUpperCase() }));
 }, [manifests]);
 // aplica filtro
 const filtered: ManifestoConsolidado[] = useMemo(() => {
   if (!filterTsps.length) return manifests;
   const allowed = new Set(filterTsps.map((t) => normalize(t)));
   return manifests.filter((m) =>
     m.transportadora ? allowed.has(m.transportadora) : false
   );
 }, [manifests, filterTsps]);
 // KPIs
 const { entregue, falta, total, perc, percFalta } = useMemo(() => {
   const entregue = filtered.filter((m) => m.statusFinal === "entregue").length;
   const falta = filtered.filter((m) => m.statusFinal === "falta entregar").length;
   const total = filtered.length;
   const base = entregue + falta;
   const perc = base > 0 ? (entregue / base) * 100 : 0;
   const percFalta = base > 0 ? 100 - perc : 0;
   return { entregue, falta, total, perc, percFalta };
 }, [filtered]);
 // gráficos
 const doughLabels = ["Entregue", "Falta entregar"];
 const doughData = [entregue, falta];
 const doughColors = ["#39d98a", "#ff4d4d"];
 const barras = useMemo(() => {
   const count: Record<string, number> = {};
   filtered.forEach((m) => {
     if (m.statusFinal === "entregue" && m.transportadora) {
       count[m.transportadora] = (count[m.transportadora] || 0) + 1;
     }
   });
   const labels = Object.keys(count).sort();
   const data = labels.map((k) => count[k]);
   return { labels: labels.map((l) => l.toUpperCase()), data };
 }, [filtered]);
 return (
<main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
     {/* Header */}
<header className="flex items-center justify-between mb-8">
<Image src="/logo.png" alt="Logo" width={900} height={750} className="h-14 w-auto" />
<h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-blue-500 to-red-500 bg-clip-text text-transparent">
         Painel de Entregas 
</h1>
<FileUploader onFile={handleFile} />
</header>
     {manifests.length === 0 ? (
<p className="text-slate-300">Faça upload do Excel para iniciar a análise.</p>
     ) : (
<>
         {/* Filtro transportadora + data embarcado */}
<div className="grid md:grid-cols-3 gap-4 mb-6">
<div className="md:col-span-2">
<TransportadoraSelect
               options={tspOptions}
               value={filterTsps}
               onChange={setFilterTsps}
             />
</div>
           {embarqueData && (
<div className="flex items-center justify-end">
<span className="text-sm text-blue-400 font-semibold">
                 🚚 Embarcado em {embarqueData}
</span>
</div>
           )}
</div>
         {/* KPIs */}
<div className="grid md:grid-cols-4 gap-4 mb-8">
<KPI
             title="Embarcado do dia"
             value={embarqueData ? embarqueData : "-"}
             color="text-blue-400"
           />
<KPI title="Entregue" value={entregue} color="text-green-400" />
<KPI title="Falta entregar" value={falta} color="text-red-400" />
<KPIProgress 
             title={<span style={{ color: "yellow"}}>Percentual de Entregas</span>}
             value={perc}
             sub={`Falta ${percFalta.toFixed(1)}% • Meta ${META}%`}
            />
</div>
         {/* Gráficos */}
<div className="grid md:grid-cols-2 gap-6">
<DoughnutChart
             title="Status Geral"
             labels={doughLabels}
             data={doughData}
             colors={doughColors}
           />
<BarChart
             title="Entregas por Transportadora"
             labels={barras.labels}
             data={barras.data}
           />
</div>
         {/* Totais */}
<div className="mt-8 text-sm text-slate-300">
<p>Total de manifestos considerados: <b>{total}</b></p>
</div>
</>
     )}
</main>
 );
}