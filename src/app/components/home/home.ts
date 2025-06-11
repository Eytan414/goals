import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app-service';
import { DBService, CategoryRecord, Category } from '../../services/db';
import { CategoryIdToNamePipe } from '../../pipes/category-id-to-name-pipe';
import { DecrementBtn } from '../decrement-btn/decrement-btn';
import { IncrementBtn } from '../increment-btn/increment-btn';
import { ChangeDate } from '../change-date/change-date';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CategoryIdToNamePipe,
    IncrementBtn,
    DecrementBtn,
    ChangeDate,
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

  weightedScore(): number {
    const records = this.appService.selectedDateRecords();
    const categories = this.appService.categories();
    let total = 0;
    records.forEach(r => {
      const catagory = categories.find(c => c.id === r.categoryId);
      total += (r.value * catagory!.weight)
    })
    return total;
  }
}
