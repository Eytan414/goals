import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DBService, Category } from '../../services/db';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  db = inject(DBService);

  data$ = this.db.getCategory();


}
