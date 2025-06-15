import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';

registerLocaleData(localeHe);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
