import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { AppService } from '../../../services/app-service';
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
  
  private calculateExtremaScoresEffect = effect(() => {
    this.appService.actionCount();
    this.db.getExtremaScores()
  });
  
  protected formattedExtrema() {
    return `${this.appService.extremaScores().min} | ${this.appService.extremaScores().max}`;
  }
}