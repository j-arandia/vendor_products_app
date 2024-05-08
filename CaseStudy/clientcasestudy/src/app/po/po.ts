import { PoItem } from './po-item';

export interface Po {
  id: number;
  vendorid: number;
  items: PoItem[];
  amount: number;
  podate: string;
}
