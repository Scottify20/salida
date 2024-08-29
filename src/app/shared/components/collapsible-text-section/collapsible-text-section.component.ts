import { Component, Input } from '@angular/core';
import { TextsSectionOptions } from '../texts-section/texts-section.component';
import {
  WindowResizeService,
  WindowResizeState,
} from '../../services/dom/window-resize.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collapsible-text-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible-text-section.component.html',
  styleUrl: './collapsible-text-section.component.scss',
})
export class CollapsibleTextSectionComponent {
  expanded: boolean = false;

  isResizing: boolean = false;
  windowDimensions: { width: number; height: number } = { width: 0, height: 0 };

  _resizeSubscription!: Subscription;

  constructor(private windowResizeService: WindowResizeService) {}

  @Input() plotSectionOptions: CollapsibleTextSectionOptions = {
    sectionTitle: '',
    texts: [],
    buttonProps: { type: 'text', textOrIconPath: '', callback: () => {} },
  };

  plotIsOverflowingCopy: boolean = false;

  plotIsOverflowing(
    textElement: HTMLElement | HTMLParagraphElement,
    textContainer: HTMLElement | HTMLDivElement
  ) {
    if (this.isResizing) {
      // handle resizing here if needed
    }
    if (textElement.scrollHeight > textContainer.clientHeight) {
      this.plotIsOverflowingCopy = true;
      return true;
    } else {
      this.plotIsOverflowingCopy = false;
      return false;
    }
  }

  ngOnInit() {
    this.windowDimensions = { width: 0, height: 0 };

    this._resizeSubscription =
      this.windowResizeService.windowResizeState$.subscribe(
        (state: WindowResizeState) => {
          this.windowDimensions = state.dimensions;
          this.isResizing = state.isResizing;
        }
      );
  }

  ngOnDestroy() {
    this._resizeSubscription?.unsubscribe();
  }
}

export interface CollapsibleTextSectionOptions extends TextsSectionOptions {
  expandOptions?: { textElementID: string };
}
