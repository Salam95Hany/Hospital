import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-admin-pagination',
  standalone: true,
  imports: [CommonModule,FormsModule,PaginationModule],
  templateUrl: './admin-pagination.component.html',
  styleUrl: './admin-pagination.component.css'
})
export class AdminPaginationComponent implements OnInit {
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() totalCount: number;
  @Input() totalPages: number;
  @Output() pageChanged = new EventEmitter<number>();
  maxSize = 3;
  showingStr = '';
  constructor() { }

  ngOnInit(): void {
    this.resetShowingStr();
  }

  ngOnChanges() {
    this.resetShowingStr();
  }

  resetShowingStr() {
    let showingStr = '';
    // last page
    const lPage = this.currentPage * this.pageSize;
    if (lPage >= this.totalCount) {
      const fNum = (this.pageSize * (this.currentPage - 1)) + 1;
      const lNum = (this.totalCount - fNum);
      showingStr = (fNum) + '-' + (lNum + fNum);
    } else {
      // last page
      if (this.totalPages === this.currentPage) {
        if (this.currentPage === 1 || this.currentPage === 0) {
          showingStr = this.currentPage + '-' + this.totalCount;
        }
        const fNum = (this.pageSize * (this.currentPage - 1));
        const lNum = (this.totalCount - fNum);
        showingStr = (fNum + 1) + '-' + (lNum + fNum);
      } else {
        if (this.currentPage === 1 || this.currentPage === 0) {
          if (this.totalCount !== 0 && (this.pageSize > this.totalCount)) {
            showingStr = this.currentPage + '-' + this.totalCount;
          } else {
            showingStr = '1-' + this.pageSize;
          }
        } else {
          showingStr = (this.pageSize * (this.currentPage - 1)) + 1 + '-' + (this.currentPage * this.pageSize);
        }
      }
    }
    this.showingStr = showingStr;
  }

  pageChangeEvevnt(event: any): void {
    this.currentPage = event.page;
    this.pageChanged.emit(event);
    this.resetShowingStr();
  }
}
