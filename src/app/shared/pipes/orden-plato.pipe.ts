import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenPlato'
})
export class OrdenPlatoPipe implements PipeTransform {

  transform(value: boolean, args?: any): string {
    return value ? "primero" : "segundo";
  }
}
