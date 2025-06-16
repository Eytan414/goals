import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CategoryIdToNamePipe } from '../../pipes/category-id-to-name-pipe';
import { DecrementBtn } from '../categories/decrement-btn/decrement-btn';
import { IncrementBtn } from '../categories/increment-btn/increment-btn';
import { AppService } from '../../services/app-service';
import { WeightedScore } from './weighted-score/weighted-score';
import { EditCategoryMaxValue } from './edit-category-max-value/edit-category-max-value';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CategoryIdToMaxValuePipe } from '../../pipes/category-id-to-max-value-pipe';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'categories',
  imports: [
    CategoryIdToNamePipe,
    CategoryIdToMaxValuePipe,
    IncrementBtn,
    DecrementBtn,
    WeightedScore,
    DialogModule,
    EditCategoryMaxValue,
    OverlayModule
],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  readonly appService = inject(AppService);
  private readonly dialog = inject(Dialog);
  showDialogForId = signal<number>(-1);

  openEditMaxDialog(categoryId: number) {
    this.showDialogForId.set(categoryId);
  }

  getFactor(categoryId: number) {
    const baseFontSizeRem = .8;
    const { weight } = this.appService.categories().find(c => c.id === categoryId)!;
    const normalized = this.calculateNormalizedWeight(weight);
    return normalized + baseFontSizeRem;
  }

  colorNegatives(categoryId: number) {
    const { weight } = this.appService.categories().find(c => c.id === categoryId)!;
    return weight < 0 ? 'negative ' : '';
  }

  private calculateNormalizedWeight(weight: number): number {
    const absoluteWeight = Math.abs(weight);
    const { minWeight, maxWeight } = this.appService.categoryWeights();
    const range = Math.max(Math.abs(minWeight), Math.abs(maxWeight));
    return absoluteWeight / range;
  }
}
