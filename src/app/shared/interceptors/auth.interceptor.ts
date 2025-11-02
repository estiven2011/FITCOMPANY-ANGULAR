import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('fit_token');

  // No romper assets del front
  if (!req.url.startsWith('http')) {
    return next(req);
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    console.log('[Interceptor] ->', authReq.method, authReq.url); // 👈 diagnóstico
    return next(authReq);
  }

  console.log('[Interceptor] (sin token) ->', req.method, req.url); // 👈 diagnóstico
  return next(req);
};
