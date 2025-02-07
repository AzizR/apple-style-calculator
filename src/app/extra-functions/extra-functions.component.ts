import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MathFunctions } from '../lib/definitions';

@Component({
  selector: 'app-extra-functions',
  imports: [CommonModule],
  templateUrl: './extra-functions.component.html',
  styleUrl: './extra-functions.component.scss',
})
export class ExtraFunctionsComponent {
  mathFunctions = Object.values(MathFunctions);
  pow = MathFunctions.Power;

  pageX = 0;
  pageY = 0;
  @Output() getResult = new EventEmitter<number | string>();

  onMouseMove(event: MouseEvent) {
    let centerX = 450;
    let centerY = 850;
    this.pageX = event.pageX / 10 - centerX / 10;
    this.pageY = event.pageY / 10 - centerY / 10;
  }

  onMouseLeave() {
    this.pageX = 0;
    this.pageY = 0;
  }
}
