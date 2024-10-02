import { Component, signal, WritableSignal } from '@angular/core';
import { DialogProps } from '../../shared/components/dialog/dialog.model';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-lists-home',
  standalone: true,
  imports: [DialogComponent],
  templateUrl: '../ui/lists-home/lists-home.component.html',
  styleUrl: '../ui/lists-home/lists-home.component.scss',
})
export class ListsHomeComponent {
  isOpenSig: WritableSignal<null | boolean> = signal(null); // should be null by default to prevent initial open or closed animation
  dialogProps: DialogProps = {
    config: {
      id: 'dialog-test',
      isBackdropEnabled: true,
      isOpenSig: this.isOpenSig,
      triggerElementIds: ['trigger-element'],
    },
    mainContent: {
      iconPath: 'assets/icons/dialog/warning.svg',
      title: 'Disable your account?',
      textItems: [
        "You'll stop receiving updates and notifications.",
        'Your profile, lists, and reviews will be hidden from other users.',
      ],
    },
    buttons: {
      primary: {
        type: 'warning',
        label: 'Disable',
        onClickCallback: () => {
          console.log('clicked primary');
        },
      },
      secondary: {
        label: 'Cancel',
        onClickCallback: () => {
          console.log('clicked secondary');
        },
      },
    },
  };

  showDialog() {
    this.isOpenSig.set(true);
  }
}
