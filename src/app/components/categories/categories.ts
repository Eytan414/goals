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
}
