import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const { user_token, secret_key } = inject(TokenService).getData();
  // Clone the request to add the authentication header.
  const headers = req.headers
    .append('Content-Type', 'application/json')
    .append('User-Token', user_token ?? '')
    .append('User-Secret-Key', secret_key ?? '');

  const newReq = req.clone({
    headers,
  });
  return next(newReq);
}
