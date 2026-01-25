import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SearchArryPipe } from '../../pipes/search-arry.pipe';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-drop-down-multi-select',
  standalone: true,
  imports: [NgIf, NgFor, SearchArryPipe, NgbDropdownModule],
  templateUrl: './admin-drop-down-multi-select.component.html',
  styleUrl: './admin-drop-down-multi-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdminDropDownMultiSelectComponent),
      multi: true,
    },
  ],
})
export class AdminDropDownMultiSelectComponent implements ControlValueAccessor, OnChanges {
  @Input() data: any[] = [];
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() colSize: string = 'col-md-6';
  @Input() disabled: boolean = false;
  @Input() showSearch: boolean = false;
  @Input() error: any;
  @Output() valueChanged = new EventEmitter<any | any[]>();
  searchText: string = '';
  selectedValue: any = '';
  searchFields: string[] = ['name'];
  SelectedList: any[] = [];

  private onChange: any = () => { };
  private onTouched: any = () => { };
  constructor(private dropdownConfig: NgbDropdownConfig, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.dropdownConfig.container = null;
  }

  ngOnChanges(changes: any): void {
    if (changes.data) {
      this.writeValue(this.selectedValue);
    }
  }

  writeValue(value: any): void {
    this.SelectedList = [];
    if (value) {
      value.split(',').forEach(id => {
        const option = this.data?.find(x => x.id == id);
        if (option) {
          this.SelectedList.push(option);
        }
      });
    }
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

  onInputChange(event: any) {
    const inputValue = event.target.value.toLowerCase();
    this.searchText = inputValue;
  }

  selectOption(option: any): void {
    if (!this.SelectedList.some(item => item.id == option.id)) {
      this.SelectedList.push(option);
      this.onChange(this.SelectedList.map(item => item.id).join(','));
      this.onTouched();
      this.valueChanged.emit(this.SelectedList.map(item => item.id).join(','));
    }
  }

  RemoveSelectedList(id: any) {
    this.SelectedList = this.SelectedList.filter(item => item.id != id);
    this.onChange(this.SelectedList.map(item => item.id).join(','));
    this.onTouched();
    this.valueChanged.emit(this.SelectedList.map(item => item.id).join(','));
  }
}
