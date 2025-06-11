import { inject, Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { AppService } from './app-service';

@Injectable({ providedIn: 'root' })
export class DBService {
  private readonly appService = inject(AppService);


  async addNewCategory(category: Category) {
    await db.categories.add(category);
  }


  async updateRecordValueByDateAndCategory(newRecord: CategoryRecord) {

  }
  async updateRecord(newRecord: CategoryRecord) {
    await db.records.put(newRecord);
    this.refetchUpdatedRecordsByDate(this.appService.selectedDate());
  }

  async refetchUpdatedRecordsByDate(date: string) {
    const chosenDateRecords = await db.records
      .where("date")
      .equals(date)
      .toArray();

    this.appService.selectedDateRecord.set(chosenDateRecords);
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
      this.appService.selectedDateRecord.set(chosenDateRecords);
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

    this.appService.selectedDateRecord.set(updatedResult);
  }

  async getCategories() {
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
    this.version(1).stores({
      records: '++id, categoryId, value, date',
      categories: '++id, name, weight',
    });
  }
}
const db = new DB();
