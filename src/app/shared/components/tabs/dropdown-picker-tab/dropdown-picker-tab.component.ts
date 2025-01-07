import { Component, Input, signal, Signal } from '@angular/core';
import { WritableSignal } from '@angular/core';
import { ExtractStringService } from '../../../services/utility/extract-string.service';

export interface DropDownPickerTabProps {
  id: string;
  text: string | (() => string) | WritableSignal<string>;
  callback: () => void;
  arrowDirection: WritableSignal<'up' | 'down'>;
  visibleIf: () => boolean;
  animateArrow?: boolean;
}

@Component({
  selector: 'app-dropdown-picker',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-picker-tab.component.html',
  styleUrl: './dropdown-picker-tab.component.scss',
})
export class DropdownPickerTabComponent {
  constructor(protected extractStringService: ExtractStringService) {}

  @Input({ required: true }) props: DropDownPickerTabProps = {
    id: '',
    text: '---',
    callback: () => {},
    visibleIf: () => {
      return false;
    },
    arrowDirection: signal('down'),
  };

  handleClick() {
    this.props.callback();
    this.props.arrowDirection.set(
      this.props.arrowDirection() === 'up' ? 'down' : 'up',
    );
  }
}
