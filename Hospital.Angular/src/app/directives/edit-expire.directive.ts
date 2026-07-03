import { Directive, ElementRef, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appEditExpire]'
})
export class EditExpireDirective {
  @Input() appEditExpire!: Date | string;

  constructor(private el: ElementRef<HTMLButtonElement>, private currentUser: AuthService) { }

  ngOnInit(): void {
    if (this.currentUser.isSuperAdmin)
      return;

    const created = new Date(this.appEditExpire);
    const diffDays = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {
      this.el.nativeElement.disabled = true;
    }
  }
}
