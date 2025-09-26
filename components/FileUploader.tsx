"use client";
import { ChangeEvent } from "react";
interface Props {
 onFile: (file: File) => void;
}
export default function FileUploader({ onFile }: Props) {
 const handle = (e: ChangeEvent<HTMLInputElement>) => {
   const f = e.target.files?.[0];
   if (f) onFile(f);
 };
 return (
<label className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded bg-slate-700 hover:bg-slate-600 cursor-pointer">
<input type="file" accept=".xlsx,.xls" onChange={handle} className="hidden" />
     Upload Excel
</label>
 );
}