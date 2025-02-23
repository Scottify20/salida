import { Component, DestroyRef, effect, ElementRef, Input, Signal, signal, ViewChild, WritableSignal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PlatformCheckService } from '../../services/dom/platform-check.service';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { fromEvent, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingDotsComponent } from '../animated/loading-dots/loading-dots.component';
import { ExtractStringService } from '../../services/utility/extract-string.service';

export interface DialogProps {
  config: {
    id: string;
    isBackdropEnabled?: boolean;
    isOpenSig: WritableSignal<boolean | null>; // should be null by default to prevent initial open or closed animation
    triggerElementIds: string[];
  };
  mainContent: {
    iconPath?: string;
    title: string | Signal<string | null | undefined> | (() => string);
    textItems?:
      | string[]
      | Signal<string | null | undefined>[]
      | (() => string)[];
  };
  buttons: {
    primary: PrimaryDialogButton;
    secondary?: DialogButton;
  };
}

interface PrimaryDialogButton extends DialogButton {
  type: 'default' | 'info' | 'success' | 'danger' | 'warning';
}

interface DialogButton {
  label: string | Signal<string | null | undefined> | (() => string);
  onClickCallback: () => void;
  isBusySig: WritableSignal<boolean>;
  isHiddenSig: WritableSignal<boolean>;
}

@Component({
    selector: 'app-dialog',
    imports: [LoadingDotsComponent],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  private elementRef = inject(ElementRef);
  private document = inject<Document>(DOCUMENT);
  private platformCheckService = inject(PlatformCheckService);
  private scrollDisablerService = inject(ScrollDisablerService);
  private destroyRef = inject(DestroyRef);
  protected extractStringService = inject(ExtractStringService);

  constructor() {
    // disables or enables the scrolling of the body element whenever the state of the isOpenSig changes
    effect(() => {
      if (this.dialogProps.config.isOpenSig()) {
        this.scrollDisablerService.disableBodyScroll(
          this.dialogProps.config.id,
        );
      } else {
        this.scrollDisablerService.enableBodyScroll(this.dialogProps.config.id);
      }
    });
  }

  @ViewChild('dialog') dialogRef!: ElementRef;
  @ViewChild('backdrop') backdropRef!: ElementRef | undefined;
  @Input({ required: true }) dialogProps: DialogProps = {
    config: {
      id: '',
      isBackdropEnabled: false,
      isOpenSig: signal(null),
      triggerElementIds: [],
    },
    mainContent: {
      iconPath: '',
      title: '',
      textItems: [],
    },
    buttons: {
      primary: {
        type: 'default',
        label: '',
        isBusySig: signal(false),
        onClickCallback: () => {},
        isHiddenSig: signal(false),
      },
    },
  };

  isPrimaryButtonBusy =
    this.dialogProps.buttons.primary.isBusySig || signal(false);
  isSecondaryButtonBusy =
    this.dialogProps.buttons.secondary?.isBusySig || signal(false);

  ngOnInit() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    this.document.body.appendChild(this.elementRef.nativeElement);
    this.startOutsideClicksListener();
    this.startListeningForEnterKey();
  }

  // this listen for the enter key while its open
  startListeningForEnterKey() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    fromEvent(document, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: any) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }

        if (event.key === 'Enter' && this.dialogProps.config.isOpenSig()) {
          // event.preventDefault();
          const primaryButton = this.dialogProps.buttons.primary;
          primaryButton.onClickCallback();

          if (!primaryButton.isBusySig) {
            this.closeDialog();
          }
        }
      });
  }

  // checks if the user clicks outside the dialog or outside the elemnents with ids listed on the props
  // then closes the dialog
  startOutsideClicksListener() {
    fromEvent(this.document, 'click')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((event) => {
          const target = event.target as Element;
          const dialog = this.dialogRef.nativeElement;
          const backdrop = this.backdropRef?.nativeElement;

          if (!target) {
            return;
          }

          if (
            target !== dialog &&
            target !== backdrop &&
            !dialog.contains(event.target) &&
            !this.dialogProps.config.triggerElementIds.includes(target.id) &&
            this.dialogProps.config.isOpenSig()
          ) {
            this.dialogProps.config.isOpenSig.set(false);
            this.resetBusyAndDisabledStates();
          }
        }),
      )
      .subscribe();
  }

  closeDialog() {
    this.dialogProps.config.isOpenSig.set(false);
  }

  resetBusyAndDisabledStates() {
    const primaryButton = this.dialogProps.buttons.primary;
    const secondaryButton = this.dialogProps.buttons.secondary;
    primaryButton.isBusySig?.set(false);
    primaryButton.isHiddenSig?.set(false);
    secondaryButton?.isBusySig?.set(false);
    secondaryButton?.isHiddenSig?.set(false);
  }

  onPrimaryButtonClicked() {
    const primaryButton = this.dialogProps.buttons.primary;
    primaryButton.onClickCallback();

    if (!primaryButton.isBusySig) {
      this.closeDialog();
    }
  }

  onSecondaryButtonClicked() {
    const secondaryButton = this.dialogProps.buttons.secondary;
    secondaryButton?.onClickCallback();

    if (!secondaryButton?.isBusySig) {
      this.closeDialog();
    }
  }

  ngOnDestroy() {
    if (this.platformCheckService.isServer()) {
      return;
    }
    this.scrollDisablerService.enableBodyScroll(this.dialogProps.config.id);
    this.document.body.removeChild(this.elementRef.nativeElement);
  }
}
