import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { AppService } from '../../../services/app-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'date-control',
  imports: [
    FormsModule,

  ],
  templateUrl: './date-control.html',
  styleUrl: './date-control.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateControl {
  readonly appService = inject(AppService);
  isTodaySelected = computed<boolean>(() => 
    this.appService.selectedDate() === this.appService.today
  );

  onDateChange(selectedDate: Event) {
    const date = new Date(String(selectedDate)).toISOString().split('T')[0];
    this.appService.selectedDate.set(date);
  }

  jumpToToday(){
    this.appService.selectedDate.set(this.appService.today);
  }
}
