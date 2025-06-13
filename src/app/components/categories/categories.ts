import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoryIdToNamePipe } from '../../pipes/category-id-to-name-pipe';
import { DecrementBtn } from '../categories/decrement-btn/decrement-btn';
import { IncrementBtn } from '../categories/increment-btn/increment-btn';
import { AppService } from '../../services/app-service';
import { WeightedScore } from './weighted-score/weighted-score';

@Component({
  selector: 'catagories',
  imports: [
    CategoryIdToNamePipe,
    IncrementBtn,
    DecrementBtn,
    WeightedScore,
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  readonly appService = inject(AppService);


  getFactor(categoryId: number) {
    const { weight } = this.appService.categories().find(c => c.id === categoryId)!;
    let classList: string = '';
    if (weight < 0) classList += 'negative ';

    const normalized = this.calculateNormalizedWeight(weight);
    return normalized + .8;
  }
  getWeightClass(categoryId: number) {
    const { weight } = this.appService.categories().find(c => c.id === categoryId)!;
    let classList: string = '';
    if (weight < 0) classList += 'negative ';

    const normalized = this.calculateNormalizedWeight(weight);

    classList += normalized > .66 ? 'heavy '
      : normalized > .33 ? 'medium '
        : 'light ';

    return classList;
  }

  private calculateNormalizedWeight(weight: number): number {
    const absoluteWeight = Math.abs(weight);
    const { minWeight, maxWeight } = this.appService.categoryWeights();
    const range = Math.max(Math.abs(minWeight), Math.abs(maxWeight));
    return absoluteWeight / range;
  }
}
