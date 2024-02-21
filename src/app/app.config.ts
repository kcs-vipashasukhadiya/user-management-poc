import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/error.interceptor';
import { provideToastr } from 'ngx-toastr';
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  provideClientHydration(),
  provideAnimations(),
  provideHttpClient(withInterceptors([errorInterceptor]), withFetch()),
  provideToastr(), { provide: RECAPTCHA_SETTINGS, useValue: { siteKey: environment.recaptcha.siteKey } as RecaptchaSettings }]
};
