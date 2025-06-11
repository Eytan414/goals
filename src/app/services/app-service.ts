import { computed, Injectable, signal } from '@angular/core';
import { Category, CategoryRecord } from './db';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  readonly today = new Date().toISOString().split('T')[0];
  selectedDate = signal<string>(this.today);
  selectedDateRecords = signal<CategoryRecord[]>([]);
  categories = signal<Category[]>([]);
}
