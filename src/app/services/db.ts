import { inject, Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { AppService } from './app-service';
import { from, switchMap, mergeMap } from 'rxjs';

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

  async reloadRecords() {
    const date = this.appService.selectedDate();
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
    this.version(12).stores({
      records: '++id, date',
      categories: '++id',
    })
    // .upgrade(tx => {
    //   return tx.table('categories').toCollection().modify(cat => {
    //     cat.maxValue = -1;
    //   });
    // });
  }
}
const db = new DB();
