import { inject, Pipe, PipeTransform } from '@angular/core';
import { AppService } from '../services/app-service';

@Pipe({
  name: 'categoryIdToName',
  pure: true,
  standalone: true
})
export class CategoryIdToNamePipe implements PipeTransform {
  readonly #appService = inject(AppService);
  
  transform(value: string | number): string | number {
    return this.#appService.categories()
      .find(c => c.id === value)?.name ?? value;
    
  }

}
