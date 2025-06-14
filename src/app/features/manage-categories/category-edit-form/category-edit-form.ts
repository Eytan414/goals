import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { AppService } from '../../../services/app-service';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { DBService, Category } from '../../../services/db';
import { CategoryFormControls } from '../category-form-controls/category-form-controls';

@Component({
  selector: 'category-edit-form',
  imports: [
    FormsModule,
    CategoryFormControls,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryEditForm {
  private readonly db = inject(DBService);
  readonly appService = inject(AppService);

  manageCategoriesForm = input.required<NgForm>();
  category = input.required<Category>();
  index = input.required<number>();

  editCategoryNames = signal<string[]>([]);
  editCategoryWeights = signal<number[]>([]);

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

  isFormDisabled(form: NgForm, i: number) {
    //TODO: needs testing and refinement (consider allow only 1 form-submit btn enabled at same time)
    return !this.editCategoryWeights()[i]
      && !this.editCategoryNames()[i];
  }


  deleteCategory(id: number) {
    const categoryToDelete: Category = this.appService.categories()
      .find(c => c.id === id)!;

    this.db.deleteCategory(categoryToDelete.id!);
  }
}
