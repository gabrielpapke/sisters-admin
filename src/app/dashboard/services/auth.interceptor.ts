import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const { user_token, secret_key } = inject(TokenService).getData();

  const headers = req.headers
    .append('Content-Type', 'application/json')
    .append('User-Token', user_token ?? '')
    .append('User-Secret-Key', secret_key ?? '');

  const newReq = req.clone({
    headers,
  });
  return next(newReq);
};
