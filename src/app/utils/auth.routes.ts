// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getLocalStorage, TOKEN_NAME } from './token';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = getLocalStorage(TOKEN_NAME);

  const publicRoutes = ['/login', '/register'];

  // 🚫 If token exists, block access to login/register pages
  if (token && publicRoutes.includes(state.url)) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  // ✅ If token doesn't exist, block access to protected routes
  if (!token && !publicRoutes.includes(state.url)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
