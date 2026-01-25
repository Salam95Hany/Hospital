import { NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-admin-general-input',
  standalone: true,
  imports: [NgIf],
  templateUrl: './admin-general-input.component.html',
  styleUrl: './admin-general-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminGeneralInputComponent),
      multi: true
    }
  ]
})
export class AdminGeneralInputComponent {
  @Input() type: 'text' | 'number' | 'date' | 'month' | 'textarea' = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() error: string | null = null;
  @Input() allowNumbersOnly: boolean = false;
  @Input() allowPaste: boolean = true;
  @Input() allowCopy: boolean = true;
  @Input() allowCut: boolean = true;
  @Input() disabled: boolean = false;
  @Input() suffix: string = '';

  private _valueBind: any = '';
  isUsingFormControl = false;

  @Input()
  set valueBind(val: any) {
    this._valueBind = val;
    if (!this.isUsingFormControl) {
      this.value = val;
    }
  }

  get valueBind() {
    return this._valueBind;
  }

  @Output() inputChanged = new EventEmitter<string>();
  value: any = '';

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.isUsingFormControl = true;
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any) {
    if (this.disabled) return;

    this.value = event.target.value;
    this.onChange(this.value);
    this.inputChanged.emit(this.value);

    if (!this.isUsingFormControl) {
      this._valueBind = this.value;
    }
  }

  NumbersOnly(key: any) {
    if (this.allowNumbersOnly) {
      let patt = /^([0-9\+.])$/;
      return patt.test(key);
    }
    return true;
  }
}
