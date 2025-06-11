import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { DBService, CategoryRecord, Category } from '../../services/db';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app-service';

@Component({
  selector: 'app-home',
  imports: [
    DatePipe,
    JsonPipe,
    FormsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly db = inject(DBService);
  readonly appService = inject(AppService);
  dateChangeEffect = effect(async () => {
    const date = this.appService.selectedDate();
    return await this.db.fetchRecordsByDate(date);
  })

  async ngOnInit() {
    await this.db.getCategories();
  }

  onDateChange(selectedDate: Event) {
    const date = new Date(String(selectedDate)).toISOString().split('T')[0];
    this.appService.selectedDate.set(date);
  }

  decrement(c: CategoryRecord) {
    const newValue = {
      ...c,
      value: c.value - 1
    }
    this.db.updateRecord(newValue);
  }
  increment(c: Category) {
    const categoryId = c.id!;
    // categoryId
    // this.displayedDate()
    // this.db.updateRecord(newValue);
  }

}
