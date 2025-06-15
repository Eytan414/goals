import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CategoryRecord, DBService } from '../../../services/db';

@Component({
  selector: 'increment-btn',
  imports: [],
  templateUrl: './increment-btn.html',
  styleUrl: './increment-btn.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncrementBtn {
  private readonly db = inject(DBService);
  record = input.required<CategoryRecord>();
  //consider allowing list edit
  binaryValueIds = signal<number[]>([11, 26]); // 0 or 1

  increment(record: CategoryRecord) {
    if(record.value === 1 && this.binaryValueIds().includes(record.categoryId))
      return;
    const newValue = {
      ...record,
      value: record.value + 1
    }
    this.db.updateRecord(newValue);
  }
}
