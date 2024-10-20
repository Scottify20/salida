import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  Inject,
  Input,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PlatformCheckService } from '../../services/dom/platform-check.service';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { fromEvent, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingDotsComponent } from '../animated/loading-dots/loading-dots.component';

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
    primary: PrimaryButton;
    secondary?: DialogButton;
  };
}

interface PrimaryButton extends DialogButton {
  type: 'default' | 'info' | 'success' | 'danger' | 'warning';
}

interface DialogButton {
  label: string | Signal<string | null | undefined> | (() => string);
  onClickCallback: () => void;
  isBusySig?: WritableSignal<boolean>;
  isHiddenSig?: WritableSignal<boolean>;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [LoadingDotsComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private platformCheckService: PlatformCheckService,
    private scrollDisablerService: ScrollDisablerService,
    private destroyRef: DestroyRef,
  ) {
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
        onClickCallback: () => {},
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

  getTextFromTextItem(
    text:
      | undefined
      | string
      | Signal<string | null | undefined>
      | (() => string),
  ): string | null | undefined {
    return !text ? undefined : typeof text === 'string' ? text : text();
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
