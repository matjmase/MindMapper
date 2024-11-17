import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionService } from '../services/session.service';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../api';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private session: SessionService,
    private authService: AuthenticationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cloned = this.cloneRequestWithJwt(req);

    if (cloned) {
      return next.handle(cloned).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(req, next, error);
          }

          return throwError(() => error);
        })
      );
    } else {
      return next.handle(req);
    }
  }

  private cloneRequestWithJwt(
    req: HttpRequest<any>
  ): HttpRequest<any> | undefined {
    const idToken = this.session.GetSavedResponse()?.jwt;

    let request = undefined;

    if (idToken) {
      request = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + idToken),
      });
    }

    return request;
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    originalError: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.session.GetSavedResponse()) {
        return this.authService
          .apiAuthenticationRefreshPost({
            expiredJwt: this.session.GetSavedResponse()?.jwt,
            refresh: this.session.GetSavedResponse()?.refresh,
          })
          .pipe(
            mergeMap((session) => {
              this.isRefreshing = false;
              this.session.SaveResponse(session);

              const cloned = this.cloneRequestWithJwt(request);

              if (cloned) {
                return next.handle(cloned);
              } else {
                return throwError(() => originalError);
              }
            }),
            catchError((error) => {
              this.isRefreshing = false;

              if (error instanceof HttpErrorResponse && error.status === 403) {
                this.session.RemoveSession();
              }

              return throwError(() => error);
            })
          );
      }
    }
    return throwError(() => originalError);
  }
}
