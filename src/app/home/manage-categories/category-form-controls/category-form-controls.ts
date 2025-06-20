import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'category-form-controls',
  imports: [
    FormsModule,
  ],

  templateUrl: './category-form-controls.html',
  styleUrl: './category-form-controls.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormControls {
  protected readonly categoryName = input.required<string>();
  protected readonly namePlaceholder = input.required<string>();
  protected readonly categoryWeight = input.required<number>();
  protected readonly weightPlaceholder = input.required<number | string>();
}
