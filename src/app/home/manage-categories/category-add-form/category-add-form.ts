import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { Category, DBService } from '../../../services/db';

@Component({
  selector: 'category-add-form',
  imports: [
    FormsModule,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  templateUrl: './category-add-form.html',
  styleUrl: './category-add-form.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryAddForm {
  private readonly db = inject(DBService);
  addNewCategoryForm = input.required<NgForm>();

  newCategoryName = signal<string>('');
  newCategoryWeight = signal<number>(NaN);

  addNewCategory(addNewCategoryForm: NgForm) {
    const newCategory: Category = {
      name: this.newCategoryName(),
      weight: this.newCategoryWeight(),
      maxValue: -1,
    };
    this.db.addNewCategory(newCategory);
    addNewCategoryForm.reset();
  }

}
