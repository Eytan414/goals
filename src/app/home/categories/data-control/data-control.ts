import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { EditCategoryMaxValue } from '../data-control/edit-category-max-value/edit-category-max-value';
import { CategoryRecord } from '../../../services/db';
import { CategoryIdToNamePipe } from '../../../pipes/category-id-to-name-pipe';
import { CategoryIdToMaxValuePipe } from '../../../pipes/category-id-to-max-value-pipe';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'data-control',
  imports: [
    EditCategoryMaxValue,
    CategoryIdToNamePipe,
    CategoryIdToMaxValuePipe,
    OverlayModule,
  ],
  templateUrl: './data-control.html',
  styleUrl: './data-control.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataControl {
  readonly record = input.required<CategoryRecord>();
  protected showDialogForId = signal<number>(-1);

  protected openEditMaxDialog(categoryId: number) {
    this.showDialogForId.set(categoryId);
  }

}
