import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

const API_URL = environment.apiUrl;

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(API_URL)) {
    const cloned = req.clone({ withCredentials: true });
    return next(cloned);
  }

  return next(req);
};
