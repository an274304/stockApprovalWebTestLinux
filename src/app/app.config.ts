import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authJWTInterceptor } from './core/Interceptor/auth-jwt.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [ // Enable fetch API for HttpClient and provide the JWT interceptor
    provideHttpClient(
      withInterceptors([authJWTInterceptor]), 
      withFetch() // Add withFetch for better SSR compatibility
    ),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes), 
  provideClientHydration()
  ]
};
