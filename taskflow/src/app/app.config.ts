import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideEnvironmentNgxMask(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    provideRouter([]),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
};
