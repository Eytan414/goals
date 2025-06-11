import { computed, Injectable, signal } from '@angular/core';
import { Category, CategoryRecord } from './db';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // readonly today = this.getPersonalLocalTZ().toISOString().split('T')[0];
  readonly today = new Date().toISOString().split('T')[0];
  selectedDate = signal<string>(this.today);
  selectedDateRecords = signal<CategoryRecord[]>([]);
  categories = signal<Category[]>([]);

  private getPersonalLocalTZ(): Date {
    const ms3Hours = 3 * 60 * 60 * 1000;
    return new Date(new Date().getTime() + ms3Hours);
  }
}
