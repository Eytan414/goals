import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DBService, CategoryRecord } from '../../services/db';

@Component({
  selector: 'decrement-btn',
  imports: [],
  templateUrl: './decrement-btn.html',
  styleUrl: './decrement-btn.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecrementBtn {
  private readonly db = inject(DBService);
  record = input.required<CategoryRecord>();
  
  decrement(record: CategoryRecord) {
    if(record.value === 0) return;
    const newValue = {
      ...record,
      value: record.value - 1
    }
    this.db.updateRecord(newValue);
  }
}
