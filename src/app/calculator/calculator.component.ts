import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { MathFunctions } from '../lib/definitions';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent {
  pi = 3.141592653589793;
  e = 2.718281828459045;
  allowedKeys = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '*',
    '/',
    '+',
    '-',
    '%',
    'Enter',
    'Backspace',
    'Clear',
    '.',
  ];
  buttons = [
    'AC',
    '+/-',
    '%',
    '÷',
    '7',
    '8',
    '9',
    'x',
    '4',
    '5',
    '6',
    '-',
    '1',
    '2',
    '3',
    '+',
    '0',
    '.',
    '=',
  ];
  output: any = 0;
  operations: string[] = ['%', 'x', '÷', '-', '+', 'pow', 'x!'];
  operation: any;
  operands: any = [];
  newOperand: boolean = false;
  editable: boolean = true;
  fontSize: number = 42;
  history: string[] = [];
  isResult: boolean = false;

  #extraOp: [MathFunctions, number] | undefined;
  @Input()
  set extraOp(extraOp: [MathFunctions, number] | undefined) {
    this.#extraOp = extraOp;

    if (!extraOp) {
      return;
    }

    console.log(extraOp);

    if (extraOp[0] == 'x!') {
      if (this.output == 0) return;
      this.output = this.calculateFuctorial(this.output);
      return;
    }

    if (extraOp[0] == '√') {
      if (this.output == 0) return;
      this.output = this.calculateSquareRoot();
      return;
    }

    if (extraOp[0] == 'pow') {
      this.displaySign('pow');
      return;
    }

    if (extraOp[0] == 'π') {
      this.displaySign(this.pi);
      return;
    }

    if (extraOp[0] == 'e') {
      this.displaySign(this.e);
      return;
    }

    this.displaySign(extraOp[0]);
  }

  get extraOp() {
    return this.#extraOp;
  }

  @Output() addToHistory: EventEmitter<string> = new EventEmitter();

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['extraOp'].currentValue) {
  //     if (changes['extraOp'].currentValue[0] == 'x!') {
  //       if (this.output == 0) return;
  //       this.output = this.calculateFuctorial(this.output);
  //       return;
  //     }
  //     if (changes['extraOp'].currentValue[0] == '√') {
  //       if (this.output == 0) return;
  //       this.output = this.calculateSquareRoot();
  //       return;
  //     }
  //     if (changes['extraOp'].currentValue[0] == 'pow') {
  //       this.displaySign('pow');
  //       return;
  //     }
  //     this.displaySign(changes['extraOp'].currentValue[0]);
  //   }
  // }

  /* Keyboard Listener */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.allowedKeys.includes(event.key)) {
      let key;
      switch (event.key) {
        case 'Enter':
          key = '=';
          break;
        case '*':
          key = 'x';
          break;
        case '/':
          key = '÷';
          break;
        case 'Clear':
          key = 'AC';
          break;
        case 'Backspace':
          if (!this.editable || this.output == 0) return;
          this.changeFontSize('Backspace');
          this.deleteLastSign(this.output);
          return;
        default:
          key = event.key;
      }
      this.displaySign(key);
    }
  }

  deleteLastSign(output: string) {
    this.output = this.output + '';
    if (
      this.output.length == 1 ||
      this.output == Infinity ||
      Number.isNaN(this.output)
    ) {
      this.clear();
      return;
    }
    let nums = this.output.split('');
    nums.pop();
    this.output = nums.join('');
  }

  /* LOGIC */
  displaySign(num: any) {
    console.log('here', num);

    if (!this.operation) {
      this.operation = [];
    }
    if (this.newOperand) {
      this.isResult = false;
      this.output = 0;
      this.newOperand = false;
      this.editable = true;
    }
    if (this.operations.includes(num)) {
      this.getOperation(num);
      return;
    }

    if (
      this.isResult &&
      !this.operations.includes(num) &&
      num != 'AC' &&
      this.output != 0
    ) {
      return;
    }

    switch (num) {
      case 'AC':
        this.clear();
        return;
      case '=':
        if (this.operation.length === 0) {
          this.operands = [];
          return;
        }
        this.getResult();
        return;
      case '+/-':
        this.reverseSign();
        return;
    }
    if (num == '.') {
      this.output = this.output + '';
      if (this.output[this.output.length - 1] == '.') return;
      this.output = this.output + num;
    } else {
      this.output = parseFloat(this.output + num);
    }
    this.changeFontSize();
  }

  changeFontSize(key = '') {
    this.output = this.output + '';
    if (this.output.length > 7 && this.output.length < 9) {
      this.fontSize = 38;
      // if (key == "Backspace") {
      //   if (this.fontSize == 42) return
      //   this.fontSize = this.fontSize > 17 ? this.fontSize + 4 : this.fontSize
      // }
      // else {
      //   this.fontSize = this.fontSize > 17 ? this.fontSize - 4 : this.fontSize
      // }
    } else if (this.output.length >= 9 && this.output.length < 12) {
      this.fontSize = 26;
    } else if (this.output.length >= 12) {
      this.fontSize = 16;
    } else {
      this.fontSize = 42;
    }
  }

  clear() {
    this.fontSize = 42;
    this.operands = [];
    this.output = 0;
    this.operation = [];
    this.editable = true;
    this.isResult = false;
  }

  saveNum() {
    if (this.operands[0] === 0) {
      this.operands.shift();
      this.editable = true;
    }
    if (!this.editable) return;
    this.operands.push(this.output);
    this.changeFontSize();
  }

  getOperation(num: any) {
    this.operation.push(num);
    this.saveNum();
    this.newOperand = true;
  }

  reverseSign() {
    this.output = -this.output;
  }

  getResult() {
    this.editable = true;
    if (this.operands.length == 0) return;
    this.saveNum();
    let index = this.calculate();
    this.output = this.operands[index];
    this.changeFontSize();
    this.editable = false;
    this.addToHistory.emit(this.history);
    this.history = [];
    this.isResult = true;
  }

  calculate() {
    let index;
    let op;
    if (this.operation.length > this.operands.length - 1) this.operation.pop();
    for (let i = 0; i < this.operations.length; i++) {
      while (this.operation.includes(this.operations[i])) {
        index = this.operation.indexOf(this.operations[i]);
        op = this.operation.splice(index, 1);
        if (this.operands[index + 1]) {
          switch (op[0]) {
            case '%':
              this.calculatePercentage(index);
              break;
            case 'x':
              this.multiple(index);
              break;
            case '÷':
              this.divide(index);
              break;
            case '+':
              this.add(index);
              break;
            case '-':
              this.substract(index);
              break;
            case 'pow':
              this.calculatePower(index);
              break;
          }
        }
      }
    }
    return index;
  }

  calculatePercentage(index: number) {
    let a = parseFloat(this.operands[index]);
    let b = parseFloat(this.operands.splice(index + 1, 1));
    this.operands[index] = (a * b) / 100;
    this.history.push(a + ' % ' + b + ' = ' + this.operands[index]);
  }

  multiple(index: number) {
    let a = parseFloat(this.operands[index]);
    let b = parseFloat(this.operands.splice(index + 1, 1));
    this.operands[index] = a * b;
    this.history.push(a + ' x ' + b + ' = ' + this.operands[index]);
  }

  divide(index: number) {
    let a = parseFloat(this.operands[index]);
    let b = parseFloat(this.operands.splice(index + 1, 1));
    this.operands[index] = a / b;
    this.history.push(a + ' / ' + b + ' = ' + this.operands[index]);
  }

  add(index: number) {
    let a = parseFloat(this.operands[index]);
    let b = parseFloat(this.operands.splice(index + 1, 1));
    this.operands[index] = a + b;
    this.history.push(a + ' + ' + b + ' = ' + this.operands[index]);
  }

  substract(index: number) {
    let a = parseFloat(this.operands[index]);
    let b = parseFloat(this.operands.splice(index + 1, 1));
    this.operands[index] = a - b;
    this.history.push(a + ' - ' + b + ' = ' + this.operands[index]);
  }

  calculatePower(index: number) {
    let a = parseFloat(this.operands[index]);
    let b = parseFloat(this.operands.splice(index + 1, 1));
    this.operands[index] = Math.pow(a, b);
    this.history.push(a + ' ^ ' + b + ' = ' + this.operands[index]);
  }

  calculateFuctorial(n: number) {
    let res: number = n > 0 ? 1 : -1;
    let story: string = n > 0 ? '1' : '-1';

    while (n > 1 || n < -1) {
      res = res * n;
      story = story + ' * ' + n;
      if (n > 0) {
        n--;
      } else {
        n++;
      }
    }
    this.history.push(story + ' = ' + res);
    this.addToHistory.emit(this.history);
    this.history = [];
    return res;
  }

  calculateSquareRoot() {
    let res = Math.sqrt(this.output);
    this.history.push('√' + this.output + ' = ' + res);
    this.addToHistory.emit(this.history);
    this.history = [];
    return res;
  }

  /* Draggable */
  mousemoveEvent: any;
  mouseupEvent: any;

  firstPopupX: number = 700;
  firstPopupY: number = 0;
  firstPopupZ: number = 3;
  xStep: number = 30;
  yStep: number = 30;
  zStep: number = 3;
  curX: number | undefined;
  curY: number | undefined;
  curZIndex: number | undefined;
  xStartElementPoint: number | undefined;
  yStartElementPoint: number | undefined;
  xStartMousePoint: number | undefined;
  yStartMousePoint: number | undefined;

  isMouseBtnOnPress: boolean | undefined;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.mouseup = this.unboundMouseup.bind(this);
    this.dragging = this.unboundDragging.bind(this);
  }

  mouseup: (event: any) => void;
  unboundMouseup(event: any) {
    // Remove listeners
    this.mousemoveEvent();
    this.mouseupEvent();
  }

  mousedown(event: any) {
    if (event.button === 0 /*left mouse click*/) {
      this.xStartElementPoint = this.curX;
      this.yStartElementPoint = this.curY;
      this.xStartMousePoint = event.pageX;
      this.yStartMousePoint = event.pageY;

      // if listeners exist, first Remove listeners
      if (this.mousemoveEvent) this.mousemoveEvent();
      if (this.mouseupEvent) this.mouseupEvent();

      this.mousemoveEvent = this.renderer.listen(
        'document',
        'mousemove',
        this.dragging
      );
      this.mouseupEvent = this.renderer.listen(
        'document',
        'mouseup',
        this.mouseup
      );
    }
  }
  dragging: (event: any) => void;
  unboundDragging(event: any) {
    this.curX =
      this.xStartElementPoint! + (event.pageX - this.xStartMousePoint!);
    this.curY =
      this.yStartElementPoint! + (event.pageY - this.yStartMousePoint!);
  }

  ngOnInit(): void {
    document.getSelection()!.removeAllRanges();
    this.setPos();
  }

  setPos() {
    this.curX = this.firstPopupX;
    this.curY = this.firstPopupY;
    this.curZIndex = this.firstPopupZ;
  }
}
