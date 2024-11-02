import {
  Component,
  effect,
  ElementRef,
  Inject,
  Input,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { PlatformCheckService } from '../../services/dom/platform-check.service';
import { DOCUMENT } from '@angular/common';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { LoadingDotsComponent } from '../animated/loading-dots/loading-dots.component';

export interface LoadingModalProps {
  config: {
    id: string;
    isOpenSig: WritableSignal<boolean | null>; // should be null by default to prevent initial open or closed animation
  };
  content: {
    title: string | Signal<string | null | undefined> | (() => string);
    textItems?:
      | string[]
      | Signal<string | null | undefined>[]
      | (() => string)[];
  };
}

@Component({
  selector: 'app-loading-modal',
  standalone: true,
  imports: [LoadingDotsComponent],
  templateUrl: './loading-modal.component.html',
  styleUrl: './loading-modal.component.scss',
})
export class LoadingModalComponent {
  constructor(
    private platformCheckService: PlatformCheckService,
    @Inject(DOCUMENT) private document: Document,
    private scrollDisablerService: ScrollDisablerService,
    private elementRef: ElementRef,
  ) {
    // disables or enables the scrolling of the body element whenever the state of the isOpenSig changes
    effect(() => {
      if (this.loadingModalProps.config.isOpenSig()) {
        this.scrollDisablerService.disableBodyScroll(
          this.loadingModalProps.config.id,
        );
      } else {
        this.scrollDisablerService.enableBodyScroll(
          this.loadingModalProps.config.id,
        );
      }
    });
  }

  @Input({ required: true }) loadingModalProps: LoadingModalProps = {
    config: {
      id: '',
      isOpenSig: signal(false),
    },
    content: {
      title: '',
      textItems: undefined,
    },
  };

  closeLoadingModal() {
    this.loadingModalProps.config.isOpenSig.set(false);
  }

  ngOnInit() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    this.document.body.appendChild(this.elementRef.nativeElement);
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
    this.scrollDisablerService.enableBodyScroll(
      this.loadingModalProps.config.id,
    );
    this.document.body.removeChild(this.elementRef.nativeElement);
  }
}
