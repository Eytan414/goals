import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { AppService, MinMax } from '../../../services/app-service';
import { DBService } from '../../../services/db';

@Component({
  selector: 'weighted-score',
  imports: [],
  templateUrl: './weighted-score.html',
  styleUrl: './weighted-score.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeightedScore {
  private readonly db = inject(DBService);
  protected readonly appService = inject(AppService);
  
  protected readonly extrema = computed<MinMax>(() => {
    return this.appService.extremaScores();
  });
  
  
  // computed<MinMax>(() => this.appService.extremaScores());

  private calculateExtremaScoresEffect = effect(() => {
    this.appService.actionCount();
    this.db.getExtremaScores()
  });
  
  protected formattedExtrema() {
    return `${this.appService.extremaScores().min} | ${this.appService.extremaScores().max}`;
  }
}