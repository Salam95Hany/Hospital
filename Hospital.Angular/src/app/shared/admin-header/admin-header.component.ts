import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Input() isCollapseOrExpand = false;
  @Output() collapseExpandContent = new EventEmitter<void>();
  collapsed = true;
  isSearchOpen = false;
  showAutoCompleteMenu = false;
  SearchText = '';
  PagesList = [
    { name: 'الرئيسية', pageUrl: '/dashboard' },
    { name: 'المرضى', pageUrl: '/patients' },
    { name: 'الأطباء', pageUrl: '/doctors' },
    { name: 'المواعيد', pageUrl: '/appointments' },
    { name: 'الأقسام', pageUrl: '/departments' },
    { name: 'المستخدمين', pageUrl: '/users' }
  ];
  UserModel = { userName: 'مدير المستشفى' };

  goToWebsite() {}
  onCollapseExpandMenu() { this.collapseExpandContent.emit(); }
  onShowAutoCompleteMenu(inputEle: any) { this.showAutoCompleteMenu = !!inputEle.value; }
  HandleSearchEle(i: number, inputEle: any) { this.SearchText = this.PagesList[i].name; this.showAutoCompleteMenu = false; inputEle.value = ''; }
  Logout() {}
}
