import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-autocomplete',
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.css'
})
export class SearchAutocompleteComponent {
  @Input() mainTitle = 'Select Patient';
  @Input() inputPlaceholder = 'Enter Patient';
  @Input() searchDescripition = 'Start typing to search patient';
  @Output() itemSearch = new EventEmitter<any>();
  @ViewChild('inputElement') inputElement!: ElementRef;
  searchControl = new FormControl('');
  selectedItem: any = null;
  results: any[] = [];
  isResultsOpen = false;
  isInputFocused = false;
  isAutoCompleteLoading = false;
  mockSuppliers: any[] = [
    { id: '1', name: 'Supplier One' },
    { id: '2', name: 'Supplier Two' },
    { id: '3', name: 'Supplier Three' },
    { id: '4', name: 'Supplier Four' },
  ];

  constructor() { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchValue => {
        this.onSearchChange(searchValue);
      });
  }

  onInputFocus(): void {
    this.isInputFocused = true;
    this.isResultsOpen = true;
    if (this.searchControl.value === '') {
      this.results = this.mockSuppliers;
    }
  }

  onInputBlur(): void {
    this.isInputFocused = false;
    setTimeout(() => {
      if (!this.isInputFocused) {
        this.isResultsOpen = false;
      }
    }, 200);
  }

  onSearchChange(searchValue: string | null): void {
    if (!searchValue) {
      this.results = [];
      return;
    }

    this.isAutoCompleteLoading = true;

    // Simulate API call delay
    setTimeout(() => {
      const query = (searchValue as string).toLowerCase();
      this.results = this.mockSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(query) ||
        (supplier.fieldValue && supplier.fieldValue.toLowerCase().includes(query)) ||
        supplier.url.toLowerCase().includes(query)
      );
      this.isAutoCompleteLoading = false;
    }, 500);
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.searchControl.setValue('');
    this.results = [];
    this.isResultsOpen = false;
    this.itemSearch.emit(item);
  }

  removeSelected(): void {
    this.selectedItem = null;
    this.searchControl.setValue('');
    this.results = [];
    this.itemSearch.emit(null);
  }
}
