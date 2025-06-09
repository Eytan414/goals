import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface Category {
  id?: number;
  name: string;
  value: number;
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
  async addCategory(category: Category): Promise<number> {
    return await db.categories.add({ name: category.name, value: category.value });
  }

  async getCategory(): Promise<Category[]> {
    return await db.categories.toArray();
  }
}
