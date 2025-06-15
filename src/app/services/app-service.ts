import { computed, Injectable, signal } from '@angular/core';
import { Category, CategoryRecord } from './db';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // readonly today = this.getPersonalLocalTZ().toISOString().split('T')[0];
  readonly today = new Date().toISOString().split('T')[0];
  categories = signal<Category[]>([]);
  categoryWeights = computed<MinMaxWeights>(() => {
    const weights = this.categories().map(c => c.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    return { minWeight, maxWeight } as MinMaxWeights;
  });

  selectedDate = signal<string>(this.today);
  dayOfWeek = computed<number>(() => new Date(this.selectedDate()).getDay());

  selectedDateRecords = signal<CategoryRecord[]>([]);
  sortedDateRecords = computed<CategoryRecord[]>(() => this.selectedDateRecords().toSorted(this.compareFn));


  private compareFn(a: CategoryRecord, b: CategoryRecord): number {
    const categories = this.categories().map(c => ({ id: c.id, weight: c.weight }));

    const aWeight: number = categories.find(c => c.id === a.categoryId)?.weight!;
    const bWeight: number = categories.find(c => c.id === b.categoryId)?.weight!;
    return Math.abs(aWeight) - Math.abs(bWeight);
  }

  private getPersonalLocalTZ(): Date {
    const ms3Hours = 3 * 60 * 60 * 1000;
    return new Date(new Date().getTime() + ms3Hours);
  }
}

type MinMaxWeights = {
  minWeight: number,
  maxWeight: number,
}