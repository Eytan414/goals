import { inject, Pipe, PipeTransform } from '@angular/core';
import { AppService } from '../services/app-service';

@Pipe({
  name: 'categoryIdToMaxValue',
  pure: false,
  standalone: true
})
export class CategoryIdToMaxValuePipe implements PipeTransform {
  readonly #appService = inject(AppService);
  
  transform(value: string | number): string | number {
    const { maxValue } = this.#appService.categories()
      .find(c => c.id === value)!;
    
      return maxValue === -1 ? '∞' : maxValue;
    
  }
}
