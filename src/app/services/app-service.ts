import { computed, Injectable, signal } from '@angular/core';
import { Category, CategoryRecord } from './db';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // readonly today = this.getPersonalLocalTZ().toISOString().split('T')[0];
  readonly today = new Date().toISOString().split('T')[0];
  categories = signal<Category[]>([]);
  selectedDate = signal<string>(this.today);
  selectedDateRecords = signal<CategoryRecord[]>([]);
  activeRecords = computed(() => {
    const categories = this.categories().map(c => ({ id: c.id, weight: c.weight }));
    return this.selectedDateRecords().toSorted((a, b) => {
      const aWeight:number = categories.find(c => c.id === a.categoryId)?.weight!;
      const bWeight:number = categories.find(c => c.id === b.categoryId)?.weight!;
      return Math.abs(aWeight) - Math.abs(bWeight);
    })
  })
  categoryWeights = computed<MinMaxWeights>(() => {
    const categories = this.categories();
    const weights = categories.map(c => c.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    return { minWeight, maxWeight } as MinMaxWeights;
  })


  private getPersonalLocalTZ(): Date {
    const ms3Hours = 3 * 60 * 60 * 1000;
    return new Date(new Date().getTime() + ms3Hours);
  }
}

type MinMaxWeights = {
  minWeight: number,
  maxWeight: number,
}