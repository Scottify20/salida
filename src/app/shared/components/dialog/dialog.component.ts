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
} from '@angular/core';
import { DialogProps } from './dialog.model';
import { DOCUMENT } from '@angular/common';
import { PlatformCheckService } from '../../services/dom/platform-check.service';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { fromEvent, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
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

  ngOnInit() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    this.document.body.appendChild(this.elementRef.nativeElement);
    this.startOutsideClicksListener();
  }

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
          } else {
          }
        }),
      )
      .subscribe();
  }

  closeDialog() {
    this.dialogProps.config.isOpenSig.set(false);
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

  ngOnDestroy() {
    if (this.platformCheckService.isServer()) {
      return;
    }
    this.scrollDisablerService.enableBodyScroll(this.dialogProps.config.id);
    this.document.body.removeChild(this.elementRef.nativeElement);
  }
}
