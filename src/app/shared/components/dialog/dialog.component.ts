import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  dialogConfig = {
    title: '',
    description: '',
    buttons: {
      left: {
        type: '',
      },

      right: {},
    },
  };
}

interface DialogConfig {
  title: string;
  description?: string;
  iconPath?: string;
  buttons: {
    left?: {
      type: DialogButtonType;
    };

    right?: {
      type: DialogButtonType;
    };
  };
}

type DialogButtonType = 'primary' | 'secondary' | 'danger' | 'warning';
