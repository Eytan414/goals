
import { inject, Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { AppService, MinMax } from './app-service';
import { min } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DBService {
  private readonly appService = inject(AppService);

  async deleteCategory(id: number) {
    await db.categories.where({ id }).delete();
    await db.records.where('categoryId').equals(id).delete();
    this.fetchCategories();
    this.reloadRecords();
  }

  async addNewCategory(category: Category) {
    await db.categories.add(category);
    this.fetchCategories();
  }

  async updateCategory(newCategory: Category) {
    await db.categories.put(newCategory);
    this.fetchCategories();
  }
  async updateRecord(newRecord: CategoryRecord) {
    await db.records.put(newRecord);
    this.reloadRecords();
  }

  async getExtremaScores() {
    const records = await db.records.toArray();
    Object.groupBy(records, r => r.date ?? 'unknown');

    const groupedByDate = Object.groupBy(records, (r => r.date));
    const results: { date: string; score: number }[] = [];
    for (const date in groupedByDate) {
      const result = {
        date,
        score: this.appService.weightedScore(groupedByDate[date]!)
      }
      results.push(result);
    }
    const minmax: MinMax = { min: 999, max: -999 };
    for (const result of results) {
      if (result.score < minmax.min)
        minmax.min = result.score;
      if (result.score > minmax.max)
        minmax.max = result.score;
    }
    this.appService.extremaScores.set(minmax);
  }

  private async reloadRecords() {
    const date = this.appService.selectedDate();
    this.appService.selectedDateRecords.set([]);
    const recordsForDate = await db.records
      .where("date")
      .equals(date)
      .toArray();
    this.appService.selectedDateRecords.set(recordsForDate);
  }

  async fetchRecordsByDate(date: string) {
    let categories = this.appService.categories();
    const chosenDateRecords = await db.records
      .where("date")
      .equals(date)
      .toArray();

    const missingCategories: Category[] = categories.filter(
      category => !chosenDateRecords.some(record => record.categoryId === category.id)
    );

    if (!missingCategories.length) {
      this.appService.selectedDateRecords.set(chosenDateRecords);
      return;
    }
    const missingRecords: CategoryRecord[] = missingCategories.map((cat: Category) => ({
      date,
      categoryId: cat.id!,
      value: 0,
    }));

    await db.records.bulkAdd(missingRecords);
    const updatedResult = await db.records
      .where('date')
      .equals(date)
      .toArray();

    this.appService.selectedDateRecords.set(updatedResult);
  }

  async fetchCategories() {
    const categories = await db.categories.toArray();
    this.appService.categories.set(categories);
    return categories;
  }

}


export interface Category {
  id?: number;
  weight: number;
  name: string;
  maxValue: number;
}
export interface CategoryRecord {
  id?: number;
  date: string;
  categoryId: number;
  value: number;
}
class DB extends Dexie {
  categories!: Table<Category, number>;
  records!: Table<CategoryRecord, number>;

  constructor() {
    super('Database');
    this.version(14).stores({
      records: '++id, date, categoryId',
      categories: '++id',
    })
    // .upgrade(tx => {
    //   const store = tx.table<CategoryRecord, number>('records');
    // });
  }
}
const db = new DB();
