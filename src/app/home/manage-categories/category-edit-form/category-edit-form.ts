import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { AppService } from '../../../services/app-service';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { DBService, Category } from '../../../services/db';
import { CategoryFormControls } from '../category-form-controls/category-form-controls';

@Component({
  selector: 'category-edit-form',
  imports: [
    FormsModule,
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryEditForm {
  private readonly db = inject(DBService);
  protected readonly appService = inject(AppService);

  readonly manageCategoriesForm = input.required<NgForm>();
  readonly category = input.required<Category>();
  readonly index = input.required<number>();
  
  protected readonly editCategoryNames = signal<string[]>([]);
  protected readonly editCategoryWeights = signal<number[]>([]);

  protected updateCategory(form: NgForm, id: number, i: number) {
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

  protected isFormDisabled(form: NgForm, i: number) {
    //TODO: needs testing and refinement (consider allow only 1 form-submit btn enabled at same time)
    return !this.editCategoryWeights()[i]
      && !this.editCategoryNames()[i];
  }


  protected deleteCategory(id: number) {
    const categoryToDelete: Category = this.appService.categories()
      .find(c => c.id === id)!;

    this.db.deleteCategory(categoryToDelete.id!);
  }
}
