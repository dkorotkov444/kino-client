// Angular core & platform
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// HTTP
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  
  // Skip adding auth header for public endpoints (login and registration)
  const isPublicEndpoint = req.url.includes('/login') || 
                           (req.url.endsWith('/users') && req.method === 'POST');
  
  if (!isPublicEndpoint && isBrowser) {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
  return next(req);
};
