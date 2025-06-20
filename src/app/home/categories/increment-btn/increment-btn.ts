import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CategoryRecord, DBService } from '../../../services/db';
import { AppService } from '../../../services/app-service';

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
  private readonly appService = inject(AppService);
  readonly record = input.required<CategoryRecord>();

  protected increment(record: CategoryRecord) {
    if (!this.canIncrement(record)) return;

    const newCategory = {
      ...record,
      value: record.value + 1
    }
    this.db.updateRecord(newCategory);
    this.appService.actionCount.update(c => c + 1);
  }

  private canIncrement(record: CategoryRecord): boolean {
    const { maxValue } = this.appService.categories()
      .find(c => c.id === record.categoryId)!;
    return maxValue === -1 ? true : maxValue > record.value;
  }
}
