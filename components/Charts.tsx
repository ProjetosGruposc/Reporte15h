"use client";
import {
 Chart as ChartJS,
 ArcElement,
 Tooltip,
 Legend,
 CategoryScale,
 LinearScale,
 BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut, Bar } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);
interface DoughnutProps {
 title: string;
 labels: string[];
 data: number[];
 colors: string[];
}
export function DoughnutChart({ title, labels, data, colors }: DoughnutProps) {
 return (
<div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
<h3 className="text-sm text-slate-300 mb-2">{title}</h3>
<div className="h-64">
<Doughnut
         data={{
           labels,
           datasets: [{ data, backgroundColor: colors }],
         }}
         options={{
           plugins: {
             legend: { position: "bottom" as const },
             datalabels: {
               color: "#000",
               backgroundColor: "rgba(255,255,255,0.85)",
               borderRadius: 4,
               padding: 3,
               font: { weight: "bold", size: 10 },
               formatter: (v: number) => (v > 0 ? v : ""),
             },
           },
           maintainAspectRatio: false,
         }}
       />
</div>
</div>
 );
}
interface BarProps {
 title: string;
 labels: string[];
 data: number[];
}
export function BarChart({ title, labels, data }: BarProps) {
 return (
<div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
<h3 className="text-sm text-slate-300 mb-2">{title}</h3>
<div className="h-64">
<Bar
         data={{
           labels,
           datasets: [
             {
               label: "Entregas",
               data,
               backgroundColor: "#4f46e5",
             },
           ],
         }}
         options={{
           plugins: {
             legend: { display: false },
             datalabels: {
               color: "#000",
               backgroundColor: "rgba(255,255,255,0.85)",
               borderRadius: 4,
               padding: 3,
               font: { weight: "bold", size: 10 },
               anchor: "end",
               align: "top",
               formatter: (v: number) => (v > 0 ? v : ""),
             },
           },
           maintainAspectRatio: false,
           scales: {
             y: { beginAtZero: true, ticks: { precision: 0 } },
           },
         }}
       />
</div>
</div>
 );
}