import { computed, Injectable, signal } from '@angular/core';
import { Category, CategoryRecord } from './db';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // readonly today = this.getPersonalLocalTZ().toISOString().split('T')[0];
  readonly today = new Date().toISOString().split('T')[0];
  categories = signal<Category[]>([]);
  categoryWeights = computed<MinMax>(() => {
    const weights = this.categories().map(c => c.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    return { min, max } as MinMax;
  });

  selectedDate = signal<string>(this.today);
  dayOfWeek = computed<Date>(() => new Date(this.selectedDate()));

  selectedDateRecords = signal<CategoryRecord[]>([]);
  sortedDateRecords = computed<CategoryRecord[]>(
    () => this.selectedDateRecords().sort(this.compareFn));
  extremaScores = signal<MinMax>({ min: 999, max: -999 });
  actionCount = signal<number>(0);


  private compareFn = (a: CategoryRecord, b: CategoryRecord): number => {
    const categories = this.categories().map(c => ({ id: c.id, weight: c.weight }));
    const aWeight: number = categories.find(c => c.id === a.categoryId)!.weight;
    const bWeight: number = categories.find(c => c.id === b.categoryId)!.weight;
    return Math.abs(aWeight) - Math.abs(bWeight);
  }

  private getPersonalLocalTZ(): Date {
    const ms3Hours = 3 * 60 * 60 * 1000;
    return new Date(new Date().getTime() + ms3Hours);
  }

  weightedScore(records: CategoryRecord[] = this.selectedDateRecords()): number {
    const categories = this.categories();
    let total = 0;
    records.forEach(r => {
      const category = categories.find(c => c.id === r.categoryId);
      total += (r.value * category!.weight)
    })
    return total;
  }
}

export type MinMax = {
  min: number,
  max: number,
}