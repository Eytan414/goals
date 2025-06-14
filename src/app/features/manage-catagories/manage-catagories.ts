import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Category, DBService } from '../../services/db';
import { AppService } from '../../services/app-service';
import { CategoryAddForm } from './category-add-form/category-add-form';

@Component({
  selector: 'manage-catagories',
  imports: [
    FormsModule,
    CategoryAddForm,

  ],
  templateUrl: './manage-catagories.html',
  styleUrl: './manage-catagories.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCatagories {
  private readonly db = inject(DBService);
  readonly appService = inject(AppService);

  editCategoryNames = signal<string[]>([]);
  editCategoryWeights = signal<number[]>([]);

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
}
