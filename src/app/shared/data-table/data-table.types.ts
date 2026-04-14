export interface ColumnDef<T = any> {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  format?: (row: T) => string;
  cssClass?: string;
  headerCssClass?: string;
}

export interface TextFilterDef {
  kind: 'text';
  key: string;
  label: string;
  icon?: string;
  placeholder?: string;
}

export interface SelectFilterDef {
  kind: 'select';
  key: string;
  label: string;
  icon?: string;
  placeholder?: string;
  options: { value: any; label: string }[];
}

export type RangeOperator = '>' | '<' | '=';

export interface RangeFilterDef {
  kind: 'range';
  key: string;
  label: string;
  icon?: string;
  placeholder?: string;
  operators?: RangeOperator[];
}

export type FilterDef = TextFilterDef | SelectFilterDef | RangeFilterDef;

export interface RangeFilterValue {
  op: RangeOperator;
  val: number | null;
}

export type FilterValue = string | number | null | RangeFilterValue;

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string | null;
  dir: SortDirection;
}
