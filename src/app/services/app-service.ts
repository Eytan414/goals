import { computed, Injectable, signal } from '@angular/core';
import { Category, CategoryRecord } from './db';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  readonly today = signal<string>(new Date().toISOString().split('T')[0]);
  readonly categories = signal<Category[]>([]);
  readonly categoryWeights = computed<MinMax>(() => {
    const weights = this.categories().map(c => c.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    return { min, max } as MinMax;
  });

  readonly selectedDate = signal<string>(this.today());
  readonly dayOfWeek = computed<Date>(() => new Date(this.selectedDate()));

  readonly selectedDateRecords = signal<CategoryRecord[]>([]);
  readonly sortedDateRecords = computed<CategoryRecord[]>(() => {
    const mappedForSortCategories = this.categories().map(c => ({ id: c.id, weight: c.weight }));
    return this.selectedDateRecords().toSorted(this.makeComparator(mappedForSortCategories))
  });
  readonly extremaScores = signal<MinMax>({ min: 999, max: -999 });
  readonly actionCount = signal<number>(0);

  weightedScore(records: CategoryRecord[] = this.selectedDateRecords()): number {
    const categories = this.categories();
    let total = 0;
    records.forEach(r => {
      const category = categories.find(c => c.id === r.categoryId);
      total += (r.value * category!.weight)
    })
    return total;
  }

  private makeComparator(mappedForSortCategories: Partial<Category>[]) {
    return (a: CategoryRecord, b: CategoryRecord): number => {
      const aWeight: number = mappedForSortCategories.find(c => c.id === a.categoryId)!.weight!;
      const bWeight: number = mappedForSortCategories.find(c => c.id === b.categoryId)!.weight!;
      return Math.abs(aWeight) - Math.abs(bWeight);
    }
  }
}

export type MinMax = {
  min: number,
  max: number,
}