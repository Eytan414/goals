import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AppService } from '../../../../services/app-service';

@Component({
  selector: 'change-date',
  imports: [],
  templateUrl: './change-date.html',
  styleUrl: './change-date.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeDate {
  private readonly appService = inject(AppService);
  direction = input.required<string>();

  changeDate() {
    const currentSelectedDate = this.appService.selectedDate();
    const date = new Date(currentSelectedDate);
    const delta = this.direction() === 'back' ? -1 : 1;

    const newDate = new Date(date);
    newDate.setDate(date.getDate() + delta);

    this.appService.selectedDate.set(newDate.toISOString().split('T')[0]);
  }
}
