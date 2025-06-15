import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AppService } from '../../../services/app-service';
import { Countdown } from './countdown/countdown';
import { ChangeDate } from './change-date/change-date';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'date-selection',
  imports: [
    FormsModule,
    Countdown,
    ChangeDate,
    DatePipe
  ],
  templateUrl: './date-selection.html',
  styleUrl: './date-selection.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateSelection {
  readonly appService = inject(AppService);

  onDateChange(selectedDate: Event) {
    const date = new Date(String(selectedDate)).toISOString().split('T')[0];
    this.appService.selectedDate.set(date);
  }
}
