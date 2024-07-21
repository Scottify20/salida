import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { routes } from './app/app.routes';
import { withInMemoryScrolling } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
  ],
}).catch((err) => console.error(err));
