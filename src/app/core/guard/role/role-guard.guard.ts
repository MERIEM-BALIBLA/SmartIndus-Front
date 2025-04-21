import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');

  if (!token) {
    router.navigateByUrl('/authentication/login');
    return false;
  }

  try {
    const payload = token.split('.')[1];
    const decodedToken = JSON.parse(atob(payload));

    // Debug
    console.log('Decoded token:', decodedToken);

    let userRole = decodedToken.role;

    // Handle fallback names
    if (!userRole) {
      userRole = decodedToken.roles || decodedToken.authorities;
    }

    const allowedRoles = route.data['roles'] as string[];
    let hasAccess = false;

    if (typeof userRole === 'string') {
      // Example: "ROLE_ADMIN"
      const roleName = userRole.replace('ROLE_', '');
      hasAccess = allowedRoles.includes(roleName);
    } else if (Array.isArray(userRole)) {
      // Example: ["ROLE_ADMIN", "ROLE_USER"]
      hasAccess = userRole.some(role => {
        const roleName = typeof role === 'string' ? role.replace('ROLE_', '') : '';
        return allowedRoles.includes(roleName);
      });
    } else if (typeof userRole === 'object') {
      // Example: { authority: "ROLE_ADMIN" } or { role: "ROLE_USER" }
      const roleValue = userRole.authority || userRole.role || '';
      const roleName = typeof roleValue === 'string' ? roleValue.replace('ROLE_', '') : '';
      hasAccess = allowedRoles.includes(roleName);
    }

    console.log('Has access:', hasAccess);

    if (hasAccess) {
      return true;
    }

    router.navigateByUrl('/unauthorized');
    return false;

  } catch (error) {
    console.error('Token decoding error:', error);
    router.navigateByUrl('/authentication/login');
    return false;
  }
};
