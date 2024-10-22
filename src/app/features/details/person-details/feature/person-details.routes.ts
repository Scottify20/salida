import { Routes } from '@angular/router';
import { PersonDetailsComponent } from './person-details.component';

export const personDetailsRoutes: Routes = [
  {
    path: '',
    component: PersonDetailsComponent,
    children: [{ path: '', redirectTo: 'details', pathMatch: 'full' }],
  },
];
