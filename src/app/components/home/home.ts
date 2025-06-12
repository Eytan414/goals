import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
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
  });
  editCategoryNames = signal<string[]>([]);
  editCategoryWeights = signal<number[]>([]);


  async ngOnInit() {
    await this.db.fetchCategories();
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
  updateCategory(form: NgForm, id: number, i: number) {
    const currentCategory: Category = this.appService.categories()
      .find(c => c.id === id)!;
    const newCategory = {
      ...currentCategory,
      name: this.editCategoryNames()[i] ?? currentCategory.name,
      weight: this.editCategoryWeights()[i] ?? currentCategory.weight,
    }
    this.db.updateCategory(newCategory);
    form.reset();
  }

  isFormDisabled(form: NgForm, i:number) {
    // return form.controls['category-name'] || form.controls['weight'];
    return !this.editCategoryWeights()[i] && !this.editCategoryNames()[i];
  }
}
