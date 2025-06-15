import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../services/app-service';
import { DBService } from '../services/db';
import { Categories } from './categories/categories';
import { ManageCategories } from './manage-categories/manage-categories';
import { DateSelection } from './date-selection/date-selection';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    Categories,
    ManageCategories,
    DateSelection,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Home implements OnInit {
  private readonly db = inject(DBService);
  readonly appService = inject(AppService);

  dateChangeEffect = effect(async () => {
    const date = this.appService.selectedDate();
    return await this.db.fetchRecordsByDate(date);
  });

  async ngOnInit() {
    await this.db.fetchCategories();
  }
}