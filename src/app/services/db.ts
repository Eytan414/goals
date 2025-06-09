import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface Category {
  id?: number;
  createdAt?: Date;
  name: string;
  value: number;
  //consider adding weight
}

class DB extends Dexie {
  categories!: Table<Category, number>;

  constructor() {
    super('Database');
    this.version(1).stores({
      categories: '++id, name, value',
    });
  }
}

const db = new DB();

@Injectable({ providedIn: 'root' })
export class DBService {
  //switch to signals
  //add get partial for specific date
  async addCategory(category: Category): Promise<number> {
    const { name, value } = category;
    return await db.categories.add({ name, value, createdAt: new Date() });
  }

  async getCategory(): Promise<Category[]> {
    return await db.categories.toArray();
  }
}
