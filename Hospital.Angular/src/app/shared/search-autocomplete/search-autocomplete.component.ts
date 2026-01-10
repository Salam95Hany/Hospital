import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-search-autocomplete',
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.css'
})
export class SearchAutocompleteComponent implements OnInit, OnChanges {
  @ViewChild('inputElement') inputElement!: ElementRef;
  @Input() mainTitle = 'Select Patient';
  @Input() inputPlaceholder = 'Enter Patient';
  @Input() searchDescripition = 'Start typing to search patient';
  @Input() searchType = 'Patient';
  @Input() itemId: number;
  @Input() selectedItem: any = null;
  @Input() disabled = false;
  @Output() itemSearch = new EventEmitter<any>();
  searchControl = new FormControl('');

  results: any[] = [];
  isResultsOpen = false;
  isInputFocused = false;
  isAutoCompleteLoading = false;

  constructor(private patientService: PatientService) { }

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled']) {
      if (this.disabled) {
        this.searchControl.disable({ emitEvent: false });
      } else {
        this.searchControl.enable({ emitEvent: false });
      }
    }

    if (changes['selectedItem'] && !changes['selectedItem'].firstChange) {
      if (!this.selectedItem) {
        this.selectedItem = null;
        this.searchControl.setValue('');
        this.results = [];
      }
    }
  }

  onInputFocus(): void {
    this.isInputFocused = true;
    this.isResultsOpen = true;

    if (this.searchType === 'Admission' && this.itemId) {
      this.loadAdmissionsForPatient();
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

    setTimeout(() => {
      const query = (searchValue as string).toLowerCase();
      let obj = {
        SearchText: query,
        SearchType: this.searchType,
        PatientId: this.itemId,
        AdmissionId: this.itemId
      }
      this.patientService.GetSearchAutoCompleteData(obj).subscribe(data => {
        this.results = data.results;
        this.isAutoCompleteLoading = false;
      });
    }, 500);
  }

  loadAdmissionsForPatient(): void {
    // this.isAutoCompleteLoading = true;

    const obj = {
      SearchText: '',
      SearchType: 'Admission',
      PatientId: this.itemId
    };

    this.patientService.GetSearchAutoCompleteData(obj).subscribe(data => {
      this.results = data.results;
      this.isAutoCompleteLoading = false;
    });
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
