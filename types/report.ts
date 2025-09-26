export type StatusCanonico =
 | "entregue"
 | "falta entregar"
 | "embarcado do dia"
 | "outro";
export interface RawRow {
 Manifesto?: string | number;
 Status?: string;
 Transportadora?: string;
 Embarcado?: string | number | Date; // ⬅️ coluna D
 [key: string]: unknown;
}
/** 1 Manifesto = 1 entrega (consolidado) */
export interface ManifestoConsolidado {
 id: string;                        // manifesto normalizado
 displayId: string;                 // manifesto original (exibição)
 statusFinal: StatusCanonico;
 transportadora?: string;
}