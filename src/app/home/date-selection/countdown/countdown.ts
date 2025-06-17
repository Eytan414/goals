import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { interval, map } from 'rxjs';
import { AppService } from '../../../services/app-service';

@Component({
  selector: 'countdown',
  imports: [AsyncPipe],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Countdown {
  private readonly appService = inject(AppService);

  readonly countdown$ = interval(ONE_SECOND).pipe(
    map(() => {
      const now = new Date();
      const nextMidnightUTC = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1
      );
      const msLeft = nextMidnightUTC - now.getTime();

      const hours = Math.floor(msLeft / ONE_HOUR);
      const minutes = Math.floor((msLeft % ONE_HOUR) / ONE_MINUTE);
      const seconds = Math.floor((msLeft % ONE_MINUTE) / ONE_SECOND);
      const result = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      if(result === '23:59:59'){//auto change date on day end
        this.appService.selectedDate.set(new Date().toISOString().split('T')[0]);
      }
      return result;
    })
  );
}
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;