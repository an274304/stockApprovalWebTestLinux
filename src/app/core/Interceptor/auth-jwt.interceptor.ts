import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { GlobalStateService } from '../../shared/services/global-state.service';

export const authJWTInterceptor: HttpInterceptorFn = (req, next) => {
  const globalStateService = inject(GlobalStateService);
  const token = globalStateService.getToken();

  let headers = req.headers;

  // If a token exists, add the Authorization header
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // Clone the request with the updated headers
  const clonedRequest = req.clone({ headers });

  return next(clonedRequest);
};
