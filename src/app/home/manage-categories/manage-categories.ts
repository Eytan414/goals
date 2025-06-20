import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app-service';
import { CategoryAddForm } from './category-add-form/category-add-form';
import { CategoryEditForm } from './category-edit-form/category-edit-form';

@Component({
  selector: 'manage-categories',
  imports: [
    FormsModule,
    CategoryAddForm,
    CategoryEditForm,
  ],
  templateUrl: './manage-categories.html',
  styleUrl: './manage-categories.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCategories {
  protected readonly appService = inject(AppService);



}
