import { Directive, ElementRef } from '@angular/core';


@Directive({
  selector: '[appTogglePasswordField]'
})
export class TogglePasswordFieldDirective {
  private shown: boolean = false;
  constructor(private el: ElementRef) {
    this.changeElementStyle();
  }
  toggle(span: HTMLElement) {
    this.shown = !this.shown;
    if (this.shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.className = `pwd-show`;
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.className = `pwd-hide`;
    }
  }
  changeElementStyle() {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('span');
    span.className = `pwd-hide`;
    span.addEventListener('click', (event) => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }
}
