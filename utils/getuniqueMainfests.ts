import { RawRow, ManifestoConsolidado } from "@/types/report";
import { canonicalManifest, canonicalStatus, normalize, pickFinalStatus } from "./status";
/** Consolida N linhas → 1 manifesto */
export function consolidateByManifest(rows: RawRow[]): ManifestoConsolidado[] {
 const map = new Map<string, ManifestoConsolidado & { flags: Set<ManifestoConsolidado["statusFinal"]> }>();
 for (const r of rows) {
   const idRaw = r.Manifesto;
   const id = canonicalManifest(idRaw);
   if (!id) continue;
   if (!map.has(id)) {
     map.set(id, {
       id,
       displayId: String(idRaw ?? "").trim(),
       statusFinal: "outro",
       transportadora: r.Transportadora ? normalize(String(r.Transportadora)) : undefined,
       flags: new Set<ManifestoConsolidado["statusFinal"]>(),
     });
   }
   const entry = map.get(id)!;
   entry.flags.add(canonicalStatus(r.Status));
   if (!entry.transportadora && r.Transportadora) {
     entry.transportadora = normalize(String(r.Transportadora));
   }
 }
 const manifests = Array.from(map.values()).map((m) => ({
   id: m.id,
   displayId: m.displayId,
   transportadora: m.transportadora,
   statusFinal: pickFinalStatus(m.flags),
 }));
 return manifests;
}