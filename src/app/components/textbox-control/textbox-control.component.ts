import {
  AfterViewInit,
  Component,
  forwardRef,
  Injector,
  Input,
  OnInit,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
export const DEFAULT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextboxControlComponent),
  multi: true,
};
@Component({
  selector: "app-textbox-control",
  templateUrl: "./textbox-control.component.html",
  styleUrls: ["./textbox-control.component.scss"],
  providers: [DEFAULT_VALUE_ACCESSOR],
})
export class TextboxControlComponent
  implements AfterViewInit, OnInit, ControlValueAccessor
{
  control: FormControl;
  @Input() isDisabled: boolean = false;
  @Input() label: string;
  @Input() placeholder: string = "";
  @Input() type: "text" | "email" | "number" = "text";
  @Input() hint: string = ""; // hint message
  @Input() maxlength: number;
  @Input() readonly = false;

  value: string = "";
  disable = "disable";

  constructor(public injector: Injector) {}

  ngOnInit() {
    console.log(this.label);
    this.control = new FormControl({ value: "", disabled: this.isDisabled });
  }

  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get<NgControl>(
      NgControl as any,
      null
    );
    if (ngControl) {
      setTimeout(() => {
        this.control = ngControl.control as FormControl;
        if (this.isDisabled) {
          this.control[this.disable]();
        }
        // this.updateValidator(this.validators);
      });
    }
  }
  /**
   *
   * @param value :- write value
   */
  writeValue(value: string): void {
    this.value = value ? value : "";
  }
  /**
   *
   * @param isDisabled :- disabled flag
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Update form when DOM element value changes (view => model)
   * @param fn :- register on change value
   */
  registerOnChange(fn: any): void {
    // Store the provided function as an internal method.
    this.onChange = fn;
  }

  /**
   * Update form when DOM element is blurred (view => model)
   * @param fn :- register on touch value
   */
  registerOnTouched(fn: any): void {
    // Store the provided function as an internal method.
    this.onTouched = fn;
  }
  /**
   *
   * @param ev :- check input value
   */
  checkInput(ev) {
    if (this.type === "number") {
      const charCode = ev.which ? ev.which : ev.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
  }
  onChange: any = () => {};
  onTouched() {}
}
