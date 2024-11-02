import {
  Component,
  computed,
  ElementRef,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformCheckService } from '../../services/dom/platform-check.service';

export interface CollapsibleTextSectionOptions {
  sectionTitle?: string; // Optional title for the section.
  text: string; // Array of text strings to display.
  maxLines: number;
  restoreScrollPosition?: boolean;
}

@Component({
  selector: 'app-collapsible-text-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible-text-section.component.html',
  styleUrl: './collapsible-text-section.component.scss',
})
export class CollapsibleTextSectionComponent {
  constructor(private platformCheckService: PlatformCheckService) {}

  @Input({ required: true })
  collapsibleTextSectionProps: CollapsibleTextSectionOptions = {
    text: '',
    maxLines: 0,
  };

  // Computed signal: True if the text content overflows its collapsed height.
  isOverFlowing = computed(
    () => this.textElementHeight() - this.collapsedHeight() > 0,
  );

  isExpanded = signal(false);

  @ViewChild('textContainer') textContainer!: ElementRef;
  @ViewChild('shadowTextContainer') shadowTextContainer!: ElementRef;
  @ViewChild('textElement') textElement!: ElementRef;

  // Signals to store the calculated heights of the elements.
  expandedHeight = signal(0);
  collapsedHeight = signal(0);
  textElementHeight = signal(0);

  // signal to store the window top position right before the text is expanded
  windowTopPositionBeforeExpand = signal(0);

  animateLengthClass = computed(() => {
    const lineHeightDiff =
      this.expandedHeight() / 1.5 / this.getRem() -
      this.collapsibleTextSectionProps.maxLines;

    return lineHeightDiff > 20
      ? 'very-very-very-long'
      : lineHeightDiff > 20
        ? 'very-very-long'
        : lineHeightDiff > 15
          ? 'very-long'
          : lineHeightDiff > 10
            ? 'long'
            : lineHeightDiff > 4
              ? 'medium'
              : 'short';
  });

  // Signal: Dynamically sets the 'max-height' style of the text container.
  currentHeight = signal('0px');
  applyTransition = false;

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit() {
    if (this.platformCheckService.isServer()) {
      return;
    }

    // Initialize the ResizeObserver to update heights when the elements resize.
    this.resizeObserver = new ResizeObserver(() => {
      this.updateHeights();
    });
    this.resizeObserver.observe(this.textContainer.nativeElement);
    this.resizeObserver.observe(this.shadowTextContainer.nativeElement);

    // Calculate initial heights after the view is initialized.
    this.updateHeights();
  }

  // Clean up the ResizeObserver when the component is destroyed.
  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // Updates the calculated heights of the text container and its shadow element.
  private updateHeights() {
    this.collapsedHeight.set(
      this.getRem() * this.collapsibleTextSectionProps.maxLines * 1.5,
    );
    this.expandedHeight.set(
      this.shadowTextContainer.nativeElement.offsetHeight +
        this.getRem() * 1.5 * 2,
    );
    this.textElementHeight.set(this.textElement.nativeElement.clientHeight);

    // Ensure the current height is updated after other height calculations.
    this.updateCurrentHeight();
  }

  // Gets the computed font size of the document's root element in pixels.
  private getRem() {
    if (this.platformCheckService.isServer()) {
      return 0;
    }
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  // Updates the 'currentHeight' signal based on the 'isExpanded' state.
  private updateCurrentHeight() {
    this.currentHeight.set(
      this.isExpanded()
        ? this.expandedHeight() + 'px'
        : this.collapsedHeight() + 'px',
    );
  }

  // Toggles the 'isExpanded' state and updates the container height.
  toggleExpanded() {
    this.isExpanded.set(!this.isExpanded());

    if (
      this.isExpanded() &&
      this.collapsibleTextSectionProps.restoreScrollPosition
    ) {
      //if isExpanded is set to true //save the window top position before the height of the text is updated
      this.windowTopPositionBeforeExpand.set(window.scrollY);
    } else if (this.collapsibleTextSectionProps.restoreScrollPosition) {
      // if the text is collapsed
      this.scrollToTopOfText();
    }

    this.updateCurrentHeight();
  }

  // scrolls to the top of the text content
  scrollToTopOfText() {
    const textContainer = this.textContainer.nativeElement as HTMLElement;

    window.scrollTo({
      behavior: 'smooth',
      top: this.windowTopPositionBeforeExpand(),
    });

    // fromEvent(textContainer, 'transitionend')
    //   .pipe(
    //     take(1),
    //     tap((event) => {
    //       window.scrollTo({
    //         behavior: 'smooth',
    //         top: this.windowTopPositionBeforeExpand(),
    //       });
    //     }),
    //   )
    //   .subscribe();
  }
}
