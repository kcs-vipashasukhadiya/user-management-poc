import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[titleCase]',
  standalone: true
})
export class TitleCaseDirective {
  el: ElementRef = inject(ElementRef);

  @HostListener('input',['$event']) onInput(event: any) {
    if (event.target.value.length == 1) {
      const currValue = event.target.value;
      this.el.nativeElement.value = currValue.charAt(0).toUpperCase() + currValue.slice(1);
    }
  }
}
