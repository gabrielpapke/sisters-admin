import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withRouterConfig } from '@angular/router';

import { authInterceptor } from '@admin/services/auth.interceptor';
import { errorHandlerInterceptor } from '@admin/services/error-handler.interceptor';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorHandlerInterceptor])
    ),

    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
};
