import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { ToastsContainerComponent } from './toasts-container/feature/toasts-container.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ToastsContainerComponent,
    NgScrollbarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Salida';
}
