import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[titleCase]',
  standalone: true
})
export class TitleCaseDirective {
  el: ElementRef = inject(ElementRef);

  @HostListener('blur') onBlur() {
    if (this.el.nativeElement.value) {
      const arr: string[] = this.el.nativeElement.value.split('');
      arr[0] = arr[0].toUpperCase();
      this.el.nativeElement.value = arr.join('');
    }
  }
}
