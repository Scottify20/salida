import {
  mergeApplicationConfig,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideExperimentalZonelessChangeDetection(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
