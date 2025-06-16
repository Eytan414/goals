import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, untracked, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DBService } from '../../../services/db';
import { AppService } from '../../../services/app-service';

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
  dialogClosed = output<boolean>();
  categoryId = input.required<number>();
  currentMaxValue = computed(() => {
    const categoryId = this.categoryId();
    const categories = untracked(() => this.app.categories()); //do not reevaluate upon categoy change
    return categories.find(c => c.id === categoryId)?.maxValue;
  });
  newValue = signal<number>(NaN);

  updateMaxValue(){
    this.dialogClosed.emit(true);
  }
}