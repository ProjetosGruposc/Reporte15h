import { StatusCanonico } from "@/types/report";
export const normalize = (s: string): string =>
 s
   .normalize("NFD")
   .replace(/\p{Diacritic}/gu, "")
   .toLowerCase()
   .trim();
export const canonicalStatus = (raw: string | undefined): StatusCanonico => {
 const s = normalize(String(raw ?? ""));
 if (s.includes("entregue")) return "entregue";
 if (s.includes("falta")) return "falta entregar";
 if (s.includes("embarc")) return "embarcado do dia";
 return "outro";
};
/** Prioridade se houver linhas conflitantes para o mesmo manifesto */
export const pickFinalStatus = (flags: Set<StatusCanonico>): StatusCanonico => {
 if (flags.has("falta entregar")) return "falta entregar";
 if (flags.has("embarcado do dia")) return "embarcado do dia";
 if (flags.has("entregue")) return "entregue";
 return "outro";
};
export const canonicalManifest = (raw: string | number | undefined): string =>
 String(raw ?? "")
   .trim()
   .replace(/[\s\-_.]/g, "");