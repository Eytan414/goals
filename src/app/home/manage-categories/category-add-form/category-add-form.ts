import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { Category, DBService } from '../../../services/db';
import { CategoryFormControls } from '../category-form-controls/category-form-controls';

@Component({
  selector: 'category-add-form',
  imports: [
    FormsModule,
    CategoryFormControls,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  templateUrl: './category-add-form.html',
  styleUrl: './category-add-form.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryAddForm {
  private readonly db = inject(DBService);
  readonly addNewCategoryForm = input.required<NgForm>();

  protected readonly newCategoryName = signal<string>('');
  protected readonly newCategoryWeight = signal<number>(NaN);

  protected addNewCategory(addNewCategoryForm: NgForm) {
    const newCategory: Category = {
      name: this.newCategoryName(),
      weight: this.newCategoryWeight(),
      maxValue: -1,
    };
    this.db.addNewCategory(newCategory);
    addNewCategoryForm.reset();
  }

}
