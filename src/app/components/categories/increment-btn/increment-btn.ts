import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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
  SLEEP_ID = 11;

  increment(record: CategoryRecord) {
    if(record.categoryId === this.SLEEP_ID && record.value === 1) return;
    const newValue = {
      ...record,
      value: record.value + 1
    }
    this.db.updateRecord(newValue);
  }
}
