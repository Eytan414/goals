import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval, map } from 'rxjs';

@Component({
  selector: 'countdown',
  imports: [AsyncPipe],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Countdown {

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

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    })
  );
}
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;