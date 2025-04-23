import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withDebugTracing} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './core/interceptor/auth-interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({eventCoalescing: true}),
//     provideRouter(routes),
//     provideHttpClient(withInterceptors([authInterceptor])),
//     provideRouter(routes, withDebugTracing()), // 👈 Active le débogage
//   ]
// };


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), // Single router configuration
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
