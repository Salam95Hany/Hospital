import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterModel } from '../../models/FilterModel';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchArryPipe } from '../../pipes/search-arry.pipe';
import { NgxDaterangepickerMd, LocaleService, LOCALE_CONFIG } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-admin-filter',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NgbDropdownModule, SearchArryPipe, NgxDaterangepickerMd],
  templateUrl: './admin-filter.component.html',
  styleUrl: './admin-filter.component.css',
  providers: [
    LocaleService,
    {
      provide: LOCALE_CONFIG,
      useValue: {
        format: 'YYYY-MM-DD',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        clearLabel: 'Clear',
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
      },
    },
  ],
})
export class AdminFilterComponent {
  @Output() FilterChecked = new EventEmitter<FilterModel[]>();
  @Input() FilterList: FilterModel[] = [];
  @Input() PlaceHolder: any;
  @Input() ApplyDateFilter = false;
  @Input() ApplyMonthFilter = false;
  @Input() ApplyDateRangeFilter = false;
  
  SelectedFilter: FilterModel[] = [];
  InputFilters = ['SearchText', 'Date', 'Month'];
  isFilterOnly = false;
  isDate = true;
  isMonth = true;
  FilterSearchText = '';
  SearchText = '';
  DateFilter: any;
  MonthFilter: any;

  constructor() { }

  InputSearchChange() {
    this.SelectedFilter = this.SelectedFilter.filter(i => i.categoryName != 'SearchText');
    if (this.SearchText)
      this.SelectedFilter.push({
        categoryName: 'SearchText',
        categoryNameAr: 'Search Text',
        itemId: this.SearchText,
        itemKey: this.SearchText
      });
    this.FilterChecked.emit(this.SelectedFilter);
  }

  filterChecked() {
    this.SelectedFilter = this.SelectedFilter.filter(i => this.InputFilters.includes(i.categoryName));
    this.FilterList.map(item => {
      let checked = item.filterItems.filter(a => a.isChecked && a.isChecked == true);
      if (checked.length > 0) {
        checked.map(obj => {
          this.SelectedFilter.push(obj);
        });
      }
    });
    this.FilterChecked.emit(this.SelectedFilter);
  }

  RemoveSelectedFilter(filter: any, index: number) {
    this.SelectedFilter.splice(index, 1);
    this.FilterList.map(item => {
      let checked = item.filterItems.find(a => a.itemId == filter.itemId);
      if (checked) {
        checked.isChecked = false;
      }
    });
    if (filter.categoryName == 'SearchText')
      this.SearchText = '';
    if (filter.categoryName == 'Date') {
      this.isDate = true;
      this.DateFilter = '';
    }

    if (filter.categoryName == 'Month') {
      this.isMonth = true;
      this.MonthFilter = '';
    }

    this.FilterChecked.emit(this.SelectedFilter);
  }

  RemoveAllFilters() {
    this.SelectedFilter = [];
    this.SearchText = '';
    this.DateFilter = '';
    this.MonthFilter = '';
    this.isDate = true;
    this.isMonth = true;
    this.FilterList.map(item => {
      item.filterItems.map(a => a.isChecked = false);
    });
    this.FilterChecked.emit(this.SelectedFilter);
  }

  DateFilterChange() {
    this.isDate = false;
    this.SelectedFilter = this.SelectedFilter.filter(i => i.categoryName != 'Date');
    if (this.DateFilter)
      this.SelectedFilter.push({
        categoryName: 'Date',
        categoryNameAr: 'Day',
        itemId: this.DateFilter,
        itemKey: this.DateFilter
      });
    this.FilterChecked.emit(this.SelectedFilter);
  }

  MonthFilterChange() {
    this.isMonth = false;
    this.SelectedFilter = this.SelectedFilter.filter(i => i.categoryName != 'Month');
    if (this.MonthFilter)
      this.SelectedFilter.push({
        categoryName: 'Month',
        categoryNameAr: 'Month',
        itemId: this.MonthFilter,
        itemKey: this.MonthFilter
      });
    this.FilterChecked.emit(this.SelectedFilter);
  }

  selected = { startDate: null, endDate: null };

  onChange(event: any) {
  if (!event?.startDate || !event?.endDate) return;
  console.log('Selected range:', event.startDate, event.endDate);
}
}
