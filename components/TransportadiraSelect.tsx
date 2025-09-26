"use client";
import Select, { MultiValue } from "react-select";
export interface Option {
 value: string;
 label: string;
}
interface Props {
 options: Option[];
 value: string[];                           // transportadoras normalizadas
 onChange: (vals: string[]) => void;
}
export default function TransportadoraSelect({ options, value, onChange }: Props) {
 const selected = value.map((v) => ({ value: v, label: v.toUpperCase() }));
 return (
<Select
     isMulti
     placeholder="Filtrar por transportadora..."
     options={options}
     value={selected}
     onChange={(val: MultiValue<Option>) =>
       onChange(val.map((x) => x.value).filter((v): v is string => !!v))
     }
     className="text-black w-full"
   />
 );
}