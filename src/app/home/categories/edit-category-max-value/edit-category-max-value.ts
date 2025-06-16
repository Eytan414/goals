import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, untracked, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, DBService } from '../../../services/db';
import { AppService } from '../../../services/app-service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'edit-category-max-value',
  imports: [
    FormsModule
  ],
  templateUrl: './edit-category-max-value.html',
  styleUrl: './edit-category-max-value.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EditCategoryMaxValue {
  private readonly db = inject(DBService);
  private readonly app = inject(AppService);
  private readonly dialogRef = inject(DialogRef);
  categoryId = input.required<number>();

  currentCategory = computed<Category>(() => {
    const categories = untracked(() => this.app.categories()); //do not reevaluate upon category change
    return categories.find(c => c.id === this.categoryId())!;
  });

  currentMaxValue = computed<number>(() => {
    const currentCategory = untracked(() => this.currentCategory()); //do not reevaluate upon category change
    const categoryId = this.categoryId();

    return currentCategory!.maxValue;
  });

  newValue = signal<number>(NaN);

  updateMaxValue(){
    const newCategory = {...this.currentCategory()};
    newCategory.maxValue = this.newValue();
    this.db.updateCategory(newCategory);
    this.dialogRef.close()
  }
}