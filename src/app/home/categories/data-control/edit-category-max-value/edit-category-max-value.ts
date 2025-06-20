import {
  AfterViewInit, ChangeDetectionStrategy, Component,
  computed, ElementRef, inject, input, model, signal, untracked,
  ViewChild, ViewEncapsulation,
  WritableSignal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, DBService } from '../../../../services/db';
import { AppService } from '../../../../services/app-service';

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
export class EditCategoryMaxValue implements AfterViewInit {

  private readonly db = inject(DBService);
  private readonly appService = inject(AppService);
  @ViewChild("maxValueInput") private maxValueInput!: ElementRef<HTMLInputElement>;
  readonly categoryId = input.required<number>();
  readonly dialogTrigger = model.required();

  protected currentCategory = computed<Category>(() => {
    const categories = untracked(() => this.appService.categories()); //do not reevaluate upon category change
    return categories.find(c => c.id === this.categoryId())!;
  });

  protected currentMaxValue = computed<number>(() => {
    const currentCategory = untracked(() => this.currentCategory()); //do not reevaluate upon category change
    const categoryId = this.categoryId();

    return currentCategory.maxValue;
  });
  protected newValue = signal<number>(NaN);


  ngAfterViewInit(): void {
    this.maxValueInput.nativeElement.focus();
  }

  protected updateMaxValue() {
    const newCategory = { ...this.currentCategory() };
    newCategory.maxValue = this.newValue();
    this.db.updateCategory(newCategory);
    this.dialogTrigger.set(-1);
  }
}