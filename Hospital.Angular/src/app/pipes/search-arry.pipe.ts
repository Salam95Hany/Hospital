import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchArry'
})
export class SearchArryPipe implements PipeTransform {
  transform(items: any[], searchText: string, fields: string[]): any[] {
    if (!items || !searchText || !fields || fields.length === 0) {
      return items;
    }

    const lowerSearchText = searchText.toLowerCase();
    return items.filter((item) =>
      fields.some((field) =>
        item[field]?.toString().toLowerCase().includes(lowerSearchText)
      )
    );
  }
}
