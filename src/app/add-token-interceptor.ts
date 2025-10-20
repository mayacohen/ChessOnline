import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req);
  if (req.url.includes('/Refresh'))
    return next(req);
  const http = inject(HttpClient);
  const accessToken = sessionStorage.getItem("accessToken");
  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          return throwError(() => error);//call activate or refresh2?
        }
        return http.post<any>("https://localhost:7070/Refresh", { refreshToken })
          .pipe(
            switchMap((token) => {
              sessionStorage.setItem("accessToken", token);
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              return next(retryReq);
            }),
            catchError(() => {
              sessionStorage.clear();
              return throwError(() => error); //logout
            })
          );
      }
      // any other error, just propagate
      return throwError(() => error);
    })
  );
};