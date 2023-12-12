import { Dayjs } from "dayjs";

export interface IReceita {
  id: number | null;
  idCategoria: number | string;
  categoria: string;
  data: Dayjs | string | null;
  descricao: string;
  valor: number;
}
