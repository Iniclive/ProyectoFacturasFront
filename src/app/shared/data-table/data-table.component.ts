import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  ColumnDef,
  FilterDef,
  FilterValue,
  RangeFilterValue,
  SelectFilterDef,
  SortState,
} from './data-table.types';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgTemplateOutlet, MatIconModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, any> = any> {
  readonly data = input.required<T[]>();
  readonly columns = input.required<ColumnDef<T>[]>();
  readonly filters = input<FilterDef[]>([]);
  readonly pageSize = input<number>(20);
  readonly rowClickable = input<boolean>(false);
  readonly emptyMessage = input<string>('No se encontraron resultados');
  readonly emptyIcon = input<string>('inbox');

  readonly actionsTemplate = contentChild<TemplateRef<{ $implicit: T }>>('actions');

  readonly rowClick = output<T>();
  readonly rowDblClick = output<T>();

  readonly showFilters = signal<boolean>(false);
  readonly filterValues = signal<Record<string, FilterValue>>({});
  readonly sort = signal<SortState>({ key: null, dir: null });
  readonly currentPage = signal<number>(0);
  readonly selectedIndex = signal<number | null>(null);

  readonly filteredData = computed<T[]>(() => {
    const rows = this.data();
    const values = this.filterValues();
    const defs = this.filters();
    if (!defs.length) return rows;

    return rows.filter((row) => {
      for (const def of defs) {
        const raw = values[def.key];
        if (raw == null || raw === '') continue;

        const rowVal = row[def.key];

        if (def.kind === 'text') {
          const q = String(raw).toLowerCase().trim();
          if (!q) continue;
          if (!String(rowVal ?? '').toLowerCase().includes(q)) return false;
        } else if (def.kind === 'select') {
          if (rowVal !== raw) return false;
        } else if (def.kind === 'range') {
          const r = raw as RangeFilterValue;
          if (r == null || r.val == null || isNaN(r.val)) continue;
          const n = Number(rowVal);
          if (isNaN(n)) return false;
          if (r.op === '>' && !(n > r.val)) return false;
          if (r.op === '<' && !(n < r.val)) return false;
          if (r.op === '=' && !(n === r.val)) return false;
        }
      }
      return true;
    });
  });

  readonly sortedData = computed<T[]>(() => {
    const rows = this.filteredData();
    const { key, dir } = this.sort();
    if (!key || !dir) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va == null && vb == null) return 0;
      if (va == null) return dir === 'asc' ? -1 : 1;
      if (vb == null) return dir === 'asc' ? 1 : -1;
      if (typeof va === 'number' && typeof vb === 'number') {
        return dir === 'asc' ? va - vb : vb - va;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return dir === 'asc' ? -1 : 1;
      if (sa > sb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  });

  readonly totalPages = computed<number>(() => {
    const size = this.pageSize();
    const total = this.sortedData().length;
    return Math.max(1, Math.ceil(total / size));
  });

  readonly pagedData = computed<T[]>(() => {
    const size = this.pageSize();
    const page = Math.min(this.currentPage(), this.totalPages() - 1);
    const start = Math.max(0, page) * size;
    return this.sortedData().slice(start, start + size);
  });

  readonly totalCount = computed<number>(() => this.data().length);
  readonly filteredCount = computed<number>(() => this.sortedData().length);

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  updateFilter(key: string, value: FilterValue): void {
    this.filterValues.update((v) => ({ ...v, [key]: value }));
    this.currentPage.set(0);
  }

  updateRangeFilter(key: string, patch: Partial<RangeFilterValue>): void {
    this.filterValues.update((v) => {
      const current = (v[key] as RangeFilterValue | undefined) ?? { op: '>', val: null };
      return { ...v, [key]: { ...current, ...patch } };
    });
    this.currentPage.set(0);
  }

  clearFilters(): void {
    this.filterValues.set({});
    this.currentPage.set(0);
  }

  clearFilter(key: string): void {
    this.filterValues.update((v) => {
      const copy = { ...v };
      delete copy[key];
      return copy;
    });
  }

  onTextFilterInput(key: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateFilter(key, value);
  }

  onSelectFilterChange(f: SelectFilterDef, event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    if (raw === '') {
      this.updateFilter(f.key, '');
      return;
    }
    const match = f.options.find((o) => String(o.value) === raw);
    this.updateFilter(f.key, match ? match.value : raw);
  }

  onRangeOpChange(key: string, event: Event): void {
    const op = (event.target as HTMLSelectElement).value as RangeFilterValue['op'];
    this.updateRangeFilter(key, { op });
  }

  onRangeValInput(key: string, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const val = raw === '' ? null : Number(raw);
    this.updateRangeFilter(key, { val });
  }

  onHeaderClick(col: ColumnDef<T>): void {
    if (!col.sortable) return;
    this.sort.update((s) => {
      if (s.key !== col.key) return { key: col.key, dir: 'asc' };
      if (s.dir === 'asc') return { key: col.key, dir: 'desc' };
      return { key: null, dir: null };
    });
  }

  sortIconFor(col: ColumnDef<T>): string {
    const s = this.sort();
    if (s.key !== col.key || !s.dir) return 'unfold_more';
    return s.dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  onRowClick(row: T, index: number): void {
    this.selectedIndex.set(index);
    this.rowClick.emit(row);
  }

  onRowDblClick(row: T): void {
    this.rowDblClick.emit(row);
  }

  goToPage(p: number): void {
    const clamped = Math.max(0, Math.min(p, this.totalPages() - 1));
    this.currentPage.set(clamped);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  getCellValue(col: ColumnDef<T>, row: T): string {
    if (col.format) return col.format(row);
    const v = row[col.key];
    return v == null ? '' : String(v);
  }

  getTextFilterValue(key: string): string {
    const v = this.filterValues()[key];
    return v == null ? '' : String(v);
  }

  getSelectFilterValue(key: string): string {
    const v = this.filterValues()[key];
    return v == null || v === '' ? '' : String(v);
  }

  getRangeFilterValue(key: string): RangeFilterValue {
    const v = this.filterValues()[key] as RangeFilterValue | undefined;
    return v ?? { op: '>', val: null };
  }

  hasTextFilterValue(key: string): boolean {
    const v = this.filterValues()[key];
    return v != null && v !== '';
  }
}
