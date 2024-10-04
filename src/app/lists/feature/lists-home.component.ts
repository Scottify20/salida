import { Component, signal, WritableSignal } from '@angular/core';
import { DialogProps } from '../../shared/components/dialog/dialog.model';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-lists-home',
  standalone: true,
  imports: [],
  templateUrl: '../ui/lists-home/lists-home.component.html',
  styleUrl: '../ui/lists-home/lists-home.component.scss',
})
export class ListsHomeComponent {}
