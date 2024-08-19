import { Component, Input } from '@angular/core';
import { TextsSectionOptions } from '../../../texts-section/texts-section.component';
import { CommonModule } from '@angular/common';
import {
  WindowResizeDimensionService,
  WindowResizeServiceUser,
} from '../../../../services/window-resize.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plot-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plot-section.component.html',
  styleUrl: './plot-section.component.scss',
})
export class PlotSectionComponent implements WindowResizeServiceUser {
  expanded: boolean = false;

  isResizing: boolean = false;
  windowDimensions: { width: number; height: number } = { width: 0, height: 0 };

  _resizeSubscription!: Subscription;
  _isResizingSubscription!: Subscription;
  constructor(private windowResizeService: WindowResizeDimensionService) {}

  @Input() plotSectionOptions: PlotSectionOptions = {
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
      this.windowResizeService.windowDimensions$.subscribe((dimensions) => {
        this.windowDimensions = dimensions;
      });

    this._isResizingSubscription =
      this.windowResizeService.isResizing$.subscribe((isResizing) => {
        this.isResizing = isResizing;
      });
  }

  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
    this._isResizingSubscription.unsubscribe();
  }
}

export interface PlotSectionOptions extends TextsSectionOptions {
  expandOptions?: { textElementID: string };
}
