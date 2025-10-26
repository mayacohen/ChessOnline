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
              const newAccessToken = token.retValue;
              sessionStorage.setItem("accessToken", newAccessToken);
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
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


// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(private http: HttpClient) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // Add token to original request (if available)
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//     }

//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401 && error.error.message === 'Token expired') {
//           // Token expired, attempt to refresh
//           return this.http.post<any>('/api/refresh-token', {}).pipe(
//             switchMap(response => {
//               // Store new token
//               localStorage.setItem('accessToken', response.newAccessToken);
//               // Retry original request with new token
//               const newRequest = request.clone({
//                 setHeaders: {
//                   Authorization: `Bearer ${response.newAccessToken}`
//                 }
//               });
//               return next.handle(newRequest);
//             }),
//             catchError(refreshError => {
//               // Handle refresh token failure (e.g., redirect to login)
//               console.error('Token refresh failed', refreshError);
//               return throwError(refreshError);
//             })
//           );
//         }
//         return throwError(error);
//       })
//     );
//   }
// }