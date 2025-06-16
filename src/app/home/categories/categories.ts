import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DecrementBtn } from '../categories/decrement-btn/decrement-btn';
import { IncrementBtn } from '../categories/increment-btn/increment-btn';
import { AppService } from '../../services/app-service';
import { WeightedScore } from './weighted-score/weighted-score';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DataControl } from './data-control/data-control';

@Component({
  selector: 'categories',
  imports: [
    IncrementBtn,
    DecrementBtn,
    WeightedScore,
    DialogModule,
    DataControl,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  readonly appService = inject(AppService);
  private readonly dialog = inject(Dialog);

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
    const { min: minWeight, max: maxWeight } = this.appService.categoryWeights();
    const range = Math.max(Math.abs(minWeight), Math.abs(maxWeight));
    return absoluteWeight / range;
  }
}
