import { inject, Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { AppService } from './app-service';

@Injectable({ providedIn: 'root' })
export class DBService {
  private readonly appService = inject(AppService);


  // TODO: add delete category (and all records that ref'd it)

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
    this.reloadRecords(this.appService.selectedDate());
  }

  async reloadRecords(date: string) {
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
      catagory => !chosenDateRecords.some(record => record.categoryId === catagory.id)
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
    this.version(9).stores({
      records: '++id, categoryId, value, date',
      categories: '++id, name, weight',
    })
  }
}
const db = new DB();
