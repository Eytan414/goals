import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppService } from '../../services/app-service';
import { Countdown } from './countdown/countdown';
import { ChangeDate } from './change-date/change-date';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateControl } from './date-control/date-control';

@Component({
  selector: 'date-selection',
  imports: [
    Countdown,
    ChangeDate,
    DateControl,
    DatePipe
  ],
  templateUrl: './date-selection.html',
  styleUrl: './date-selection.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateSelection {
  readonly appService = inject(AppService);

}
