import {
  Component,
  forwardRef,
  Renderer,
  ElementRef,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "app-check-box",
  templateUrl: "./check-box.component.html",
  styleUrls: ["./check-box.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckBoxComponent),
      multi: true,
    },
  ],
})
export class CheckBoxComponent implements ControlValueAccessor {
  checkFlag: boolean = false;
  @Output() change: EventEmitter<boolean>;
  @Input() showError: boolean = false;
  checked: boolean = false;

  constructor(private renderer: Renderer, private elementRef: ElementRef) {
    this.change = new EventEmitter<boolean>();
  }
  propagateChange = (_: any) => {};
  onTouchedCallback: () => {};

  writeValue(value: any) {
    this.checked = value;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  toggleCheck() {
    this.checked = !this.checked;
    this.propagateChange(this.checked);
    // this.onTouchedCallback();
    this.change.emit(this.checked);
  }

  spaceKeyup(event) {
    if (event.keyCode == 32) {
      this.toggleCheck();
    }
  }
}
