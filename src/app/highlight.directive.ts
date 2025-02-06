import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  mouseenter() {
    this.highlight('#ffff0080');
  }

  @HostListener('mouseleave')
  mouseleave() {
    this.highlight(null);
  }

  highlight(color: string | null) {
    this.el.nativeElement.style.background = color;
  }
}
