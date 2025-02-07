import { Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CalculatorComponent } from './calculator/calculator.component';
import { ExtraFunctionsComponent } from './extra-functions/extra-functions.component';
import { HighlightDirective } from './highlight.directive';
import { CommonModule } from '@angular/common';
import { MathFunctions } from './lib/definitions';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    CalculatorComponent,
    ExtraFunctionsComponent,
    HighlightDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Calculator';
  calculationsHistory: any = [];
  check: any = [];
  extraOp: any;
  count: number = 0;

  constructor(private el: ElementRef) {
    this.calculationsHistory.push('Calculations History: ');
  }

  updateCheckValue(val: any) {
    console.log(val);
  }

  addToHistory(entry: string | string[]) {
    this.calculationsHistory.push(entry);
  }

  onGetResult(mathFunction: MathFunctions) {
    this.extraOp = [mathFunction, this.count++];
  }
}
