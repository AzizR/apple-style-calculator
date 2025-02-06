import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-extra-functions',
  imports: [CommonModule],
  templateUrl: './extra-functions.component.html',
  styleUrl: './extra-functions.component.scss',
})
export class ExtraFunctionsComponent {
  extraButtons: any = ['pow', '√', 'x!', 'π', 'e', 'ln', 'log10'];
  pi: number = 3.141592653589793;
  e: number = 2.718281828459045;
  pageX: any = 0;
  pageY: any = 0;

  @Output() getResult: EventEmitter<any> = new EventEmitter();

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    let centerX = 450;
    let centerY = 850;
    this.pageX = event.pageX / 10 - centerX / 10;
    this.pageY = event.pageY / 10 - centerY / 10;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.pageX = 0;
    this.pageY = 0;
  }

  constructor() {}

  ngOnInit(): void {}

  calculate(operation: string) {
    // console.log(operation)
    switch (operation) {
      case 'pow':
        this.getResult.emit('pow');
        break;
      case '√':
        this.getResult.emit('√');
        break;
      case 'x!':
        this.getResult.emit('faktorial');
        break;
      case 'π':
        this.getResult.emit(this.pi);
        break;
      case 'e':
        this.getResult.emit(this.e);
        break;
    }
  }
}
