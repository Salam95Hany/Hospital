import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  debugger
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const token = auth.UserModel?.token;
  const isAuthEndpoint = /Auth\/AdminLogin/i.test(req.url) || /Auth\/AdminLogout/i.test(req.url);
  const isHttp = req.url.startsWith('http');
  let request = req;
  if (isHttp && !isAuthEndpoint && token && auth.isAuthenticated()) {
    debugger
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        toastr.error('Authentication required', 'Unauthorized');
        auth.loginRedirect();
      }
      return throwError(() => error);
    })
  );
};
