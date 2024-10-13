import {
  Component,
  computed,
  ElementRef,
  Input,
  signal,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformCheckService } from '../../services/dom/platform-check.service';

@Component({
  selector: 'app-collapsible-text-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible-text-section.component.html',
  styleUrl: './collapsible-text-section.component.scss',
})
export class CollapsibleTextSectionComponent
  implements AfterViewInit, OnDestroy
{
  constructor(private platformCheckService: PlatformCheckService) {}

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

  // Signal: Dynamically sets the 'max-height' style of the text container.
  currentHeight = signal('0px');
  applyTransition = false;

  @Input({ required: true })
  collapsibleTextSectionProps: CollapsibleTextSectionOptions = {
    texts: [],
  };

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
    this.collapsedHeight.set(this.getRem() * 3 * 1.5);
    this.expandedHeight.set(
      this.shadowTextContainer.nativeElement.offsetHeight,
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
    this.updateCurrentHeight();
  }
}

export interface CollapsibleTextSectionOptions {
  sectionTitle?: string; // Optional title for the section.
  texts: string[]; // Array of text strings to display.
}
