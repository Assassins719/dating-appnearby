import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'height',
})
export class Height implements PipeTransform {
  transform(value: number, ...args) {
    return Math.floor(value/12) + "'"+ value%12 +"''";
  }
}
