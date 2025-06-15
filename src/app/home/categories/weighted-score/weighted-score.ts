import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppService } from '../../../services/app-service';

@Component({
  selector: 'weighted-score',
  imports: [],
  templateUrl: './weighted-score.html',
  styleUrl: './weighted-score.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeightedScore {
  readonly appService = inject(AppService);

  weightedScore(): number {
    const records = this.appService.selectedDateRecords();
    const categories = this.appService.categories();
    let total = 0;
    records.forEach(r => {
      const category = categories.find(c => c.id === r.categoryId);
      total += (r.value * category!.weight)
    })
    return total;
  }
}
