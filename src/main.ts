import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {provideHttpClient} from '@angular/common/http';

// bootstrapApplication(AppComponent, appConfig,)
//   .catch((err) => console.error(err));
// Si appConfig est un objet de configuration existant
const config = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(),
    provideRouter(routes)
  ]
};

bootstrapApplication(AppComponent, config).catch(err => console.error(err));
