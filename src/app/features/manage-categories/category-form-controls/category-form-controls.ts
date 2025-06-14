import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
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
  categoryName = input.required<string>();
  categoryWeight = input.required<number>();
  namePlaceholder = input.required<string>();
  weightPlaceholder = input.required<number | string>();

}
