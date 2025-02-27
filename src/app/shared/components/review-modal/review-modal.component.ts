import {
  Component,
  effect,
  ElementRef,
  Inject,
  Input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PlatformCheckService } from '../../services/dom/platform-check.service';
import { ScrollDisablerService } from '../../services/dom/scroll-disabler.service';
import { ExtractStringService } from '../../services/utility/extract-string.service';
import { Review } from '../../interfaces/models/tmdb/All';
import { ReviewComponent } from '../../../features/details/shared/ui/review/review.component';

export interface ReviewModalProps {
  config: {
    id: string;
    isOpenSig: WritableSignal<boolean | null>; // should be null by default to prevent initial open or closed animation
  };
  review: WritableSignal<Review | null>;
}

@Component({
  selector: 'app-review-modal',
  imports: [ReviewComponent],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss',
})
export class ReviewModalComponent {
  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private platformCheckService: PlatformCheckService,
    private scrollDisablerService: ScrollDisablerService,
    protected extractStringService: ExtractStringService,
  ) {
    // disables or enables the scrolling of the body element whenever the state of the isOpenSig changes
    effect(() => {
      if (this.props.config.isOpenSig()) {
        this.scrollDisablerService.disableBodyScroll(this.props.config.id);
      } else {
        this.scrollDisablerService.enableBodyScroll(this.props.config.id);
      }
    });
  }

  @ViewChild('dialog') dialogRef!: ElementRef;
  @ViewChild('backdrop') backdropRef!: ElementRef | undefined;

  @Input({ required: true }) props: ReviewModalProps = {
    config: {
      id: '',
      isOpenSig: signal(null),
    },
    review: signal(null),
  };

  ngOnInit() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    this.document.body.appendChild(this.elementRef.nativeElement);
  }

  closeDialog() {
    this.props.config.isOpenSig.set(false);
  }

  ngOnDestroy() {
    if (this.platformCheckService.isServer()) {
      return;
    }
    this.scrollDisablerService.enableBodyScroll(this.props.config.id);
    this.document.body.removeChild(this.elementRef.nativeElement);
  }
}
