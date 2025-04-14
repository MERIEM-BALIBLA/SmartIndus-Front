import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');

  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  try {
    const payload = token.split('.')[1];
    const decodedToken = JSON.parse(atob(payload));
    const userRole = decodedToken.role;

    if (!userRole) {
      router.navigateByUrl('/unauthorized');
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<string>;
    if (allowedRoles.includes(userRole)) {
      return true;
    }

    return false;

  }
  catch (error) {
    console.error('Token decoding error:', error);
    router.navigateByUrl('/login');
    return false;
  }
};
