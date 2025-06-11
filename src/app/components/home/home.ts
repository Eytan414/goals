import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app-service';
import { DBService, CategoryRecord } from '../../services/db';
import { CategoryIdToNamePipe } from '../../pipes/category-id-to-name-pipe';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CategoryIdToNamePipe,    
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

  decrement(record: CategoryRecord) {
    const newValue = {
      ...record,
      value: record.value - 1
    }
    this.db.updateRecord(newValue);
  }

  increment(record: CategoryRecord) {
    const newValue = {
      ...record,
      value: record.value + 1
    }
    this.db.updateRecord(newValue);
  }

}
