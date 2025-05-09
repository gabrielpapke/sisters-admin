import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorHandlerService, ValidationError } from './error-handler.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const snack = inject(MatSnackBar);
  const errorService = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        router.navigate(['/configuracoes']);
        snack.open('Acesso negado');
      }

      if (error instanceof HttpErrorResponse && error.status === 422) {
        const validationError = error.error as ValidationError;
        errorService.handleValidationError(validationError);
      }

      return throwError(() => error);
    })
  );
};
